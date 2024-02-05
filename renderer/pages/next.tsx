import React from 'react'
import Head from 'next/head'
import { Button, Link as ChakraLink } from '@chakra-ui/react'


import { Container } from '../components/Container'
import { Footer } from '../components/Footer'
import { Hero } from '../components/Hero'
import NewWindow from 'react-new-window'

export default function NextPage() {
	return (
		<React.Fragment>
			<Head>
				<title>Next - Nextron (with-chakra-ui)</title>
			</Head>
			<Container minHeight="100vh">
				<Hero title={`⚡ Nextron ⚡`} />
				<Footer>
					<Button as={ChakraLink} href="/home" variant="outline" colorScheme="teal" rounded="button" width="full">
						Go to home page
					</Button>
					<NewWindow>
						
					</NewWindow>
				</Footer>
			</Container>
		</React.Fragment>
	)
}
