import React, { useState, useRef } from 'react'
import Head from 'next/head'
import { Button, Link as ChakraLink } from '@chakra-ui/react'
import { useReactToPrint } from 'react-to-print'

import { Container } from '../components/Container'
import { Footer } 	 from '../components/Footer'
import { Hero } 	 from '../components/Hero'

import querytest from './test'

export default function HomePage() {
	const [isOpen, setIsOpen]  = useState(false)
	const componentRef = useRef()
	const handlePrint = useReactToPrint({ content: () => componentRef.current })

	const toggle = () => {
		setIsOpen(!isOpen)
		console.log(open)
	}

	return (
		<React.Fragment>
			<Head>
				<title>Home - Nextron (with-chakra-ui)</title>
			</Head>
			<Container minHeight="100vh">
				<Hero title={`⚡Electron⚡ + Next.js + Chakra UI = 🔥`} />
				<Footer>
					<Button onClick={toggle} variant="solid" colorScheme="teal" rounded="button" width="full" >
						Get Graph
					</Button>
					{isOpen ? querytest(componentRef, handlePrint) : null}
				</Footer>
			</Container>
		</React.Fragment>
	)
}
