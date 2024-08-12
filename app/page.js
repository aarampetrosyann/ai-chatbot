'use client'
import { Avatar, Box, Button, Stack, TextField, Typography, Link, } from '@mui/material'
import { useState, useRef, useEffect } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Icon } from '@iconify/react'
import ReactMarkdown from 'react-markdown';


export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm here to chat. How are you doing today?",
    },
  ])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const theme = createTheme({
    palette: {
      primary: {
        main: '#e2e8f0', // Replace with your desired primary color
      },
      secondary: {
        main: '#c4b5fd', // Replace with your desired secondary color
      },
    },
    components: {
      MuiAvatar: {
        styleOverrides: {
          root: {
            marginLeft: '0px', // Override margin-left globally
          },
        },
      },
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior: 'smooth'})
  }
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  //sendMessage function
  const sendMessage = async () => {
    if (!message.trim()) return;  // Don't send empty messages

  setMessage('')
  setMessages((messages) => [
    ...messages,
    { role: 'user', content: message },
    { role: 'assistant', content: '' },
  ])

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const text = decoder.decode(value, { stream: true })
      setMessages((messages) => {
        let lastMessage = messages[messages.length - 1]
        let otherMessages = messages.slice(0, messages.length - 1)
        return [
          ...otherMessages,
          { ...lastMessage, content: lastMessage.content + text },
        ]
      })
    }
  } catch (error) {
    console.error('Error:', error)
    setMessages((messages) => [
      ...messages,
      { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
    ])
  }
  setIsLoading(false)
  }
  const handleKeyPress = (event) => {
    if(event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          marginTop: '0px',
          paddingTop: '0px',
          backgroundImage: 'url(/images/img1.jpg)',
          backgroundSize: 'cover',
          height: '100vh',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 16px',
            bgcolor: 'ffffff',
            borderRadius: '8px 8px 0 0',  // Rounded corners on top
            boxShadow: 1,
            marginBottom: '0px',  // Space between header and chat area
            maxWidth: '600px', 
            margin: '0 auto',
            boxShadow: 'none',
          }}
        >
          <Avatar sx={{ bgcolor: 'transparent', marginRight: '3px', alignItems: 'center', display: 'flex'}}>
            <Icon icon='uil:heartbeat' fontSize='50px' color='#000000'/>
          </Avatar>
          <Typography variant="h6" sx={{ color: '#000000', fontSize: '32px'}}>
            WillowAI
          </Typography>
        </Box>
        <Stack
          direction={'column'}
          width="600px"
          height="725px"
          border="1px solid black"
          p={2}
          spacing={3}
          bgcolor="#ffffff"
          sx={{
            borderRadius: '10px',
          }}
        >
          <Stack
            direction={'column'}
            spacing={2}
            flexGrow={1}
            overflow="auto"
            maxHeight="100%"
            ml={0}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={
                  message.role === 'assistant' ? 'flex-start' : 'flex-end'
                }
              >
                {message.role === 'assistant' && (
                  <Avatar sx={{ bgcolor: 'secondary.main', mr: 1, ml: 0}}>
                    <Icon icon="uil:shutter" fontSize='24px' color='#000000'/>
                  </Avatar>
                )}
                <Box
                  bgcolor={
                    message.role === 'assistant'
                      ? 'primary.main'
                      : 'secondary.main'
                  }
                  color="#000000"
                  borderRadius={message.role === 'assistant'
                    ? '10px 10px 10px 0px'
                    : '10px 10px 0px 10px'
                  }
                  p={1.5}
                >
                  <ReactMarkdown>
                    {message.content}
                  </ReactMarkdown>
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Stack>
          <Stack direction={'row'} spacing={2}>
            <TextField
              borderRadius='14px'
              placeholder='Message WillowAI...'
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              InputProps={{
                sx: {
                  bgcolor: "#e2e8f0",
                },
                endAdornment: (
                  <Button 
                    variant="contained" 
                    onClick={sendMessage} 
                    disabled={isLoading}
                    disableRipple
                    sx={{
                      boxShadow: 'none',
                      padding: 0,
                      fontSize: '28px',
                      minWidth: 'auto',
                      bgcolor: 'transparent',
                      '&:hover': {
                        bgcolor: 'transparent',
                        boxShadow: 'none',
                      },
                      '&:hover .icon': {
                        color: '#52525b', // Custom hover color
                      },
                      '&:active .icon': {
                        color: '#2196f3', // Custom active (click) color
                      },
                    }}
                  >
                    <Icon 
                      icon="uil:telegram-alt" 
                      className='icon'
                      sx={{
                        color: '#52525b',
                        transition: 'color 0.5s ease',
                      }}
                    />
                  </Button>
                ),
              }}
            />
          </Stack>
        </Stack>
      </Box>
      <Box
        component="footer"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: '#000000',
          color: '#c4b5fd',
          padding: '10px',
          position: 'fixed',
          bottom: 0,
          width: '100%',
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            mr: 2, 
            width: "600px",
            margin: '0 auto',
            display: 'inline',
          }}
        >
          Built by{' '} 
          <Link 
            href="https://linkedin.com/in/a-petrosyan"
            target="_blank"
            sx={{ 
              color: '#ffffff',
              textDecoration: 'underline',
              textDecorationColor: 'inherit',
              textUnderlineOffset: '4px',
              fontWeight: 600,
              //ml: 0.5,
              '&:visited': {
                color: 'inherit',
              },
            }}
          >
            Aram
          </Link>{', '}
          <Link 
            href="https://linkedin.com/in/gregory-simonyan/"
            target="_blank"
            sx={{ 
              color: '#ffffff',
              textDecoration: 'underline',
              textDecorationColor: 'inherit',
              textUnderlineOffset: '4px',
              fontWeight: 600,
              //ml: 0.5,
              '&:visited': {
                color: 'inherit',
              },
            }}
          >
            Greg
          </Link>{', '}
          and{' '}
          <Link 
            href="https://linkedin.com/in/levon-gyulgyulyan/"
            target="_blank"
            sx={{ 
              color: '#ffffff',
              textDecoration: 'underline',
              textDecorationColor: 'inherit',
              textUnderlineOffset: '4px',
              fontWeight: 600,
              //ml: 0.5,
              '&:visited': {
                color: 'inherit',
              },
            }}
          >
            Levon
          </Link>{'. '}
          The source code is available on{''}
          <Link 
            href="https://github.com/wd40wd40wd40/AI_Chatbot"
            target="_blank"
            sx={{ 
              color: '#ffffff',
              textDecoration: 'underline',
              textDecorationColor: 'inherit',
              textUnderlineOffset: '4px',
              fontWeight: 600,
              ml: 0.5,
              '&:visited': {
                color: 'inherit',
              },
            }}
          >
            GitHub
          </Link>{'. '}
        </Typography>
      </Box>
    </ThemeProvider>
  )
}