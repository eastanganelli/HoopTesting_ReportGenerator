import React from 'react'
import Head from 'next/head'
import { Button, Link as ChakraLink } from '@chakra-ui/react'

import NewWindow from 'react-new-window'

import { Container } from '../components/Container'
import { Footer } from '../components/Footer'
import { Hero } from '../components/Hero'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { faker } from '@faker-js/faker'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const features ={
    popup:  0,
    top:    0,
    left:   0,
    height: 763,
    width:  1366,
    menubar: 0
}

class ComponentToPrint extends React.Component {
    render() {
        const options = {
            responsive: true,
            interaction: {
                mode: 'index' as const,
                intersect: false,
            },
            stacked: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Chart.js Line Chart - Multi Axis',
                },
            },
            scales: {
                y: {
                    type: 'linear' as const,
                    display: true,
                    position: 'left' as const,
                },
                y1: {
                    type: 'linear' as const,
                    display: true,
                    position: 'right' as const,
                    grid: {
                        drawOnChartArea: false,
                    },
                },
            },
        };
        const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const data = {
            labels,
            datasets: [
                {
                    label: 'Pressure',
                    data: labels.map(() => faker.number.int({ min: 0, max: 30 })),
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    yAxisID: 'y',
                },
                {
                    label: 'Temperature',
                    data: labels.map(() => faker.number.int({ min: 0, max: 90 })),
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    yAxisID: 'y1',
                },
            ],
        };

        const page_ = "size: 210 297";
        return (
            <div>
            <Container height="297mm" width="210mm" backgroundColor="white">
                <Hero title={`Test Nro: XXXXXXXXXXXXX`} />
                <Line options={options} data={data} redraw={true} />
                <Footer>
                </Footer>
            </Container>
            <Container height="297mm"  width="210mm" backgroundColor="white">
                <Line options={options} data={data} />
                <Footer>
                </Footer>
            </Container>
            </div>
        );
    }
}

export default function querytest(componentRef, handlePrint) {

    return (
        <NewWindow title="Generador de Reportes - Sample [XX] Specimen [XX]" features={features}>
        <React.Fragment>
            <Head>
                <title>Next - Nextron (with-chakra-ui)</title>
            </Head>
            <Button onClick={handlePrint}>Print PDF</Button>
            <Container >
                <ComponentToPrint ref={componentRef}/>
            </Container>
        </React.Fragment>
        </NewWindow>
    )
}