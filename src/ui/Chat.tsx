import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Center,
  Flex,
  IconButton,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import path from "path";
import React, { useEffect, useState } from 'react';
import { exists, readTextFile, BaseDirectory } from '@tauri-apps/api/fs';

import { Assistant } from "../core/Assistant";
import { Message, MessageHandler } from "../core/MessageHandler";
import { Prompt, PromptAttributes } from "../core/Prompt";
import MessageBubble from "./MessageBubble";

// This is the message type that you've provided in your example
interface ChatMessage {
  role: string;
  content: string;
}

// Chat component
const messages: Message[] = [];

const Chat: React.FC = () => {
  // For tracking user's input
  const [inputValue, setInputValue] = useState('');

  // For managing the list of messages
  const [chatMessages, setChatMessages] = useState<Message[]>(messages);

  const promptFolder = "foo-1820";
  const promptFilePath = path.join("prompts", promptFolder, "prompt.json");
  const messagesFilePath = path.join("prompts", promptFolder, "messages.json");

  const messageHandler = new MessageHandler(messagesFilePath);
  const assistant = new Assistant(process.env.OPENAI_API_KEY as any);

  useEffect(() => {
    const loadMessages = async () => {
      return await messageHandler.readMessages();
    };

    const messages = loadMessages().then((messages) => {
      setChatMessages(messages);
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    const messages: Message[] = await messageHandler.readMessages();

    // Add the new message to the chatMessages array
    setChatMessages(prevState => [ ...prevState, { role: 'user', content: inputValue }])
    
    // Clear the input field
    setInputValue('');

    // Call the API to get the assistant's response
    messageHandler.addMessage({
      content: inputValue,
      role: "user",
    } as Message);

    const fileExists = await exists(promptFilePath, { dir: BaseDirectory.Desktop });

    let promptAttributes: PromptAttributes;
    if (fileExists) {
      console.log("exists!")

      const promptContents = await readTextFile(promptFilePath, { dir: BaseDirectory.Desktop });
      promptAttributes = JSON.parse(promptContents);

      // Add validation checks here

      try {
        const assistantOutput = await assistant.createResponse(
          new Prompt(promptAttributes),
          messageHandler.getMessages(),
        );
  
        messageHandler.addMessage({
          content: assistantOutput,
          role: "assistant",
        } as Message);
  
        // Add the assistant's response to the chatMessages array
        setChatMessages(prevState => [
          ...prevState,
          { role: 'assistant', content: assistantOutput },
        ]);
      } catch (error: any) {
        console.error("Error communicating with AI: ", error.message);
      }
    } else {
      console.log("does not exist :'(")
      // First run, set up default settings and ask user for prompt details
      // promptAttributes = {
      //   /* default settings */
      // };
    }
  };

  return (
    <Center minH="100vh" minW="100vw">
      <Flex
        w={['95%', '75%', '50%', '50%']} //Responsive width adjustment
        minH="90vh"
        flexDirection="column"
        boxShadow="xl"
        borderRadius="lg"
        bg="white"
        p="5"
      >
        <VStack align="stretch" flex="1" overflowY="auto" spacing="3">
          {chatMessages.map((message, index) => (
            <MessageBubble key={index} role={message.role} content={message.content} />
          ))}
        </VStack>
        <Box pt="5">
          <Flex alignItems="center">
          <Textarea
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type your message..."
            size="md"
            flexGrow={1}
            fontFamily="body"
            fontSize="medium"
            mr="2"
            borderRadius="md"
            _focus={{
              borderColor: 'blue.500',
            }}
            boxShadow="base"
            borderColor="gray.300"
            resize="none"
          />
            <IconButton
              icon={<AddIcon />}
              colorScheme="blue"
              onClick={handleSendMessage}
              aria-label="Send message"
            />
          </Flex>
        </Box>
      </Flex>
    </Center>
  );
};

export default Chat;