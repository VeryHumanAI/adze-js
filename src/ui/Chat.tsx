import React from 'react';
import { Flex, Box, Text, VStack, Center } from '@chakra-ui/react';

import Message from "./Message"

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
  return (
    <Center minH="100vh" minW="100vw">
      <VStack
        w={['95%', '75%', '50%', '33%']} //Responsive width adjustment
        spacing="3"
        p="5"
        boxShadow="xl"
        borderRadius="lg"
        bg="white"
      >
        {messages.map((message, index) => (
          <Message key={index} role={message.role} content={message.content} />
        ))}
      </VStack>
    </Center>
  );
};

export default Chat;