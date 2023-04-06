import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Center,
  Flex,
  IconButton,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';

import Message from "./Message";

// This is the message type that you've provided in your example
interface ChatMessage {
  role: string;
  content: string;
}

// Chat component
const messages: ChatMessage[] = [
  { role: 'user', content: 'Hello, I have a question.' },
  { role: 'assistant', content: 'Of course! What can I help you with?' },
  // Add more messages here
];

const Chat: React.FC = () => {
  // For tracking user's input
  const [inputValue, setInputValue] = useState('');

  // For managing the list of messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(messages);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    // Add the new message to the chatMessages array
    setChatMessages([
      ...chatMessages,
      { role: 'user', content: inputValue },
    ]);

    // Clear the input field
    setInputValue('');
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
            <Message key={index} role={message.role} content={message.content} />
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