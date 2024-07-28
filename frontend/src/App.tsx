import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Card, Text } from '@mantine/core'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
  <Card shadow='lg'>
    <Text>Hello</Text>
  </Card>
      </>
  )
}

export default App
