import React from 'react';
import { Flex, Box, Text, VStack, Center } from '@chakra-ui/react';

// Message component
interface MessageProps {
  role: string;
  content: string;
}

const Message: React.FC<MessageProps> = ({ role, content }) => {
  const isUser = role === 'user';
  const justifyContent = isUser ? 'flex-end' : 'flex-start';
  const bgColor = isUser ? 'blue.500' : 'gray.200';
  const textColor = isUser ? 'white' : 'gray.800';
  const borderRadius = isUser ? '20px 20px 0px 20px' : '20px 20px 20px 0px';

  return (
    <Flex justifyContent={justifyContent} mb="3">
      <Box
        maxW="70%"
        bg={bgColor}
        color={textColor}
        borderRadius={borderRadius}
        p="3"
        boxShadow="md"
      >
        <Text fontSize="md">{content}</Text>
      </Box>
    </Flex>
  );
};

export default Message;
