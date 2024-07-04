import dynamic from 'next/dynamic';
import ReactPDFChart from 'react-pdf-charts';
import { useRouter } from 'next/router';
import { FunctionComponent, useEffect, useState } from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { LineChart, Line, XAxis, YAxis, Label } from 'recharts';
import { Layout } from 'antd';
const PDFViewer = dynamic(() => import('@react-pdf/renderer').then((mod) => mod.PDFViewer), { ssr: false });

import QueryService from '../utils/database/query';

import type { TestData, TestDataValues } from '../interfaces/query';

const { Content } = Layout;

const styles = {
	PDFStyle: StyleSheet.create({
		page: {
			height: '100vh',
			// backgroundColor: '#E4E4E4'
		},
		section: {
			margin: '25mm 19.1mm 25mm 19.1mm',
			// backgroundColor: 'white'
		},
	}),
	Content: StyleSheet.create({
		table: { display: 'flex', flexDirection: 'column', fontSize: '10px' },
		row: { flexDirection: 'row' },
		cell: { flex: 1, justifyContent: 'center', textAlign: 'left', padding: 4, whiteSpace: 'nowrap'}
	}),
};

const cellPropiertes = {
	length: {
		small: { maxWidth: '35mm' },
		medium: { maxWidth: '50.9mm' },
		large: { maxWidth: '80mm' },
		half: { maxWidth: '85.9mm' },
		third: { maxWidth: '136.8mm' },
		full: { maxWidth: '171.8mm' },
	},
	child: { borderBottom: '1 solid black' },
	fullBorder: { border: '1 solid black' }
};

const chartLine = {
	width: 525,
	height: 350,
	margin: { top: 15, right: 25, bottom: 0, left: -25 },
	yAxisDomain: ['auto', 'auto'],
	xAxis: { yPosition: 10 }
}

const PrinterPage: FunctionComponent = () => {
	const { query, isReady } = useRouter();
    const [axisColors, setAxisColors] 		  = useState<{ pressureColor: string; temperatureColor: string; }>({ pressureColor: '00ff00', temperatureColor: 'ff0000' });
    const [pdfConfig, setPDFConfig]			  = useState<{ companyName: string; }>({ companyName: 'None' });
	const [myTest, setMyTest] 				  = useState<TestData>(null);
	const [myData, setMyData] 				  = useState<TestDataValues[]>(null);
	const [hoursInSeconds, setHoursInSeconds] = useState<number[]>(null);
	
    useEffect(() => {
        const storedConfig    = JSON.parse(localStorage.getItem('chartConfig') || '{}');
		const storedPDFConfig = JSON.parse(localStorage.getItem('pdfConfig') || '{}');
        if (storedConfig) {
            setAxisColors({ pressureColor: storedConfig.pressureColor, temperatureColor: storedConfig.temperatureColor });
        }
		if (storedPDFConfig) {
			setPDFConfig({ companyName: storedPDFConfig.companyName });
		}
    }, []);

	const MyDocument = () => {
		return (
			<Document
				title    = {pdfConfig['companyName'] + ` - Reporte de la Prueba ${myTest?.mySpecimen?.idSpecimen} - ${(new Date()).toDateString()}`}
				subject  = {pdfConfig['companyName'] + ` - Reporte de la Prueba ${myTest?.mySpecimen?.idSpecimen} - ${(new Date()).toDateString()}`}
				producer = {pdfConfig['companyName']}
				author   = {pdfConfig['companyName']}
				creator  = {`${myTest?.mySpecimen?.operator}`}
			>
				<Page size='A4' style={styles.PDFStyle.page}>
					{/* Parte superior del informe */}
					<View style={styles.PDFStyle.section}>
						<Text style={{ margin: '0 auto 0 auto', fontSize: '30px' }}>{pdfConfig['companyName']}</Text>
						<Text style={{ margin: '0 auto 0 auto', fontSize: '24px', paddingTop: '10px', paddingBottom: '40px' }}>Reporte de la Prueba</Text>
						<View style={styles.Content.table}>
							<View style={styles.Content.row}>
								<Text style={[styles.Content.cell, cellPropiertes.length.small]}>{`ID Prueba`}</Text>
								<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.child]}>{myTest?.mySpecimen?.idSpecimen}</Text>
								<Text style={[styles.Content.cell, cellPropiertes.length.small]}>{`Nombre de la\nPrueba`}</Text>
								<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.child]}>{myTest?.mySpecimen?.testName}</Text>
							</View>
							<View style={styles.Content.row}>
								<Text style={[styles.Content.cell, cellPropiertes.length.small]}>{`Cantidad de\nEspecimenes`}</Text>
								<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.child]}>{myTest?.mySpecimen?.counts < 2 ? 'Muestra' : 'Muestras'} {myTest?.mySpecimen?.counts}</Text>
								<Text style={[styles.Content.cell, cellPropiertes.length.small]}>{`Estándar`}</Text>
								<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.child]}>{myTest?.mySample?.standard}</Text>
							</View>
							<View style={styles.Content.row}>
								<Text style={[styles.Content.cell, cellPropiertes.length.small]}>{`Entorno`}</Text>
								<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.child]}>{myTest?.mySpecimen?.enviroment}</Text>
								<Text style={[styles.Content.cell, cellPropiertes.length.small]}>{`Tapa de Extremo`}</Text>
								<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.child]}>{myTest?.mySpecimen?.endCap}</Text>
							</View>
							<View style={styles.Content.row}>
								<Text style={[styles.Content.cell, cellPropiertes.length.small]}>{`Operador`}</Text>
								<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.child]}>{myTest?.mySpecimen?.operator}</Text>
								<Text style={[styles.Content.cell, cellPropiertes.length.small]}></Text>
								<Text style={[styles.Content.cell, cellPropiertes.length.medium]}></Text>
							</View>
						</View>

						{/* Parte superior del informe */}
						<View style={[styles.Content.table, { paddingTop: '40px' }]}>
							<View style={styles.Content.row}>
								<Text style={[styles.Content.cell, cellPropiertes.length.full, cellPropiertes.fullBorder]}>{`Prueba Nro: ${myTest?.mySpecimen?.counts}`}</Text>
							</View>
							<View style={styles.Content.row}>
								<Text style={[styles.Content.cell, cellPropiertes.length.small, cellPropiertes.fullBorder]}>{`Material`}</Text>
								<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.fullBorder]}>{myTest?.mySample?.material}</Text>
								<Text style={[styles.Content.cell, cellPropiertes.length.small, cellPropiertes.fullBorder]}>{`Especificación`}</Text>
								<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.fullBorder]}>{myTest?.mySample?.specification}</Text>
							</View>
							<View style={styles.Content.row}>
								<Text style={[styles.Content.cell, cellPropiertes.length.small, cellPropiertes.fullBorder]}>{`Diámetro Real [mm]`}</Text>
								<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.fullBorder]}>{myTest?.mySample?.diameterReal}</Text>
								<Text style={[styles.Content.cell, cellPropiertes.length.small, cellPropiertes.fullBorder]}>{`Diámetro Normal [mm]`}</Text>
								<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.fullBorder]}>{myTest?.mySample?.diameterNominal}</Text>
							</View>
							<View style={styles.Content.row}>
								<Text style={[styles.Content.cell, cellPropiertes.length.small, cellPropiertes.fullBorder]}>{`Longitud Libre [mm]`}</Text>
								<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.fullBorder]}>{myTest?.mySample?.lengthFree}</Text>
								<Text style={[styles.Content.cell, cellPropiertes.length.small, cellPropiertes.fullBorder]}>{`Longitud Total [mm]`}</Text>
								<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.fullBorder]}>{myTest?.mySample?.lengthTotal}</Text>
							</View>
							<View style={styles.Content.row}>
								<Text style={[styles.Content.cell, cellPropiertes.length.small, cellPropiertes.fullBorder]}>{`Tiempo de\nPrueba`}</Text>
								<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.fullBorder]}>{myTest?.mySpecimen?.duration}</Text>
								<Text style={[styles.Content.cell, cellPropiertes.length.small, cellPropiertes.fullBorder]}>{`Temperatura [C]`}</Text>
								<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.fullBorder]}>{myTest?.mySpecimen?.targetTemperature}</Text>
							</View>
							<View style={styles.Content.row}>
								<Text style={[styles.Content.cell, cellPropiertes.length.small, cellPropiertes.fullBorder]}>{`Grosor Pared [mm]`}</Text>
								<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.fullBorder]}>{myTest?.mySample?.wallThickness}</Text>
								<Text style={[styles.Content.cell, cellPropiertes.length.small, cellPropiertes.fullBorder]}>{`Período de\nCondicionamiento`}</Text>
								<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.fullBorder]}>{myTest?.mySample?.conditionalPeriod}</Text>
							</View>
							<View style={styles.Content.row}>
								<Text style={[styles.Content.cell, cellPropiertes.length.small, cellPropiertes.fullBorder]}>{`Hoop Stress [Bar]`}</Text>
								<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.fullBorder]}>{``}</Text>
								<Text style={[styles.Content.cell, cellPropiertes.length.small, cellPropiertes.fullBorder]}>{`Presión [Bar]`}</Text>
								<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.fullBorder]}>{myTest?.mySpecimen?.targetPressure}</Text>
							</View>
							<View style={styles.Content.row}>
								<Text style={[styles.Content.cell, cellPropiertes.length.small, cellPropiertes.fullBorder]}>{`Fecha de\nInicio`}</Text>
								<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.fullBorder]}>{myTest?.mySpecimen?.beginTime}</Text>
								<Text style={[styles.Content.cell, cellPropiertes.length.small, cellPropiertes.fullBorder]}>{`Fecha de\nFinalización`}</Text>
								<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.fullBorder]}>{myTest?.mySpecimen?.endTime}</Text>
							</View>
							<View style={styles.Content.row}>
								<Text style={[styles.Content.cell, cellPropiertes.length.small, cellPropiertes.fullBorder]}>{`Tipo de Falla`}</Text>
								<Text style={[styles.Content.cell, cellPropiertes.length.third, cellPropiertes.fullBorder]}>{myTest?.mySpecimen?.fail}</Text>
							</View>
							<View style={styles.Content.row}>
								<Text style={[styles.Content.cell, cellPropiertes.length.small, cellPropiertes.fullBorder]}>{`Observaciones`}</Text>
								<Text style={[styles.Content.cell, cellPropiertes.length.third, cellPropiertes.fullBorder]}>{myTest?.mySpecimen?.remark}</Text>
							</View>
						</View>
					</View>
				</Page>
				<Page size='A4' style={styles.PDFStyle.page}>
					<View style={styles.PDFStyle.section}>
						<Text style={{ margin: '0 auto 0 auto', fontSize: '13px' }}>{`Presión [Bar]`}</Text>
						<ReactPDFChart>
							<LineChart data={myData} height={chartLine['height']} width={chartLine['width']} margin={chartLine['margin']}>
								<XAxis dataKey="key" ticks={hoursInSeconds} tickFormatter={(tick) => `${tick / 3600}`}><Label dy={chartLine['xAxis']['yPosition']} value="Tiempo [Hora]" /></XAxis>
								<YAxis yAxisId="left" dataKey="pressure" domain={chartLine['yAxisDomain']} />
								<Line  yAxisId="left" type="monotone" dataKey="pressure" name="Presión" stroke={axisColors['pressureColor']} scale='identity' dot={false} isAnimationActive={false} />
							</LineChart>
						</ReactPDFChart>
						<Text style={{ margin: '10px auto 0 auto', fontSize: '13px' }}>{`Temperatura [°C]`}</Text>
						<ReactPDFChart>
							<LineChart data={myData} height={chartLine['height']} width={chartLine['width']} margin={chartLine['margin']}>
								<XAxis dataKey="key" ticks={hoursInSeconds} tickFormatter={(tick) => `${tick / 3600}`}><Label dy={chartLine['xAxis']['yPosition']} value="Tiempo [Hora]" /></XAxis>
								<YAxis yAxisId="left" dataKey="temperature" domain={chartLine['yAxisDomain']} />
								<Line  yAxisId="left" type="monotone" dataKey="temperature" name="Temperatura" scale='identity' stroke={axisColors['temperatureColor']} dot={false} isAnimationActive={false} />
							</LineChart>
						</ReactPDFChart>
					</View>
				</Page>
			</Document>
		);
	}

	useEffect(() => {
		const id_specimen: number = Number(query['idSpecimen']) as number;
		if (isReady && id_specimen > 0) {
			let hoursInSecondsAux: number[] = [];

			QueryService.SELECT.TEST.Test([id_specimen]).then((data: TestData) => {
				setMyTest(data[0]);
			}).then(() => {
				QueryService.SELECT.TEST.Data([id_specimen]).then((myTestValues: TestDataValues[]) => {
					setMyData(myTestValues);
					for (let i = Math.min(...myTestValues.map(d => d.key)); i <= Math.max(...myTestValues.map(d => d.key)); i += 3600) {
						hoursInSecondsAux.push(i);
					}
					setHoursInSeconds(hoursInSecondsAux);
				});
			});
		}
	}, [isReady]);

	return (
		<Layout style={{ background: "lightgray", overflow: "auto" }}>
			<Layout>
				<Content style={{ padding: '12px' }}>
					<div style={{ margin: "auto", background: "white", padding: 24, borderRadius: 25 }} >
						<PDFViewer style={{ width: "100%", height: '90.5vh', borderRadius: 25 }}>{MyDocument()}</PDFViewer>
					</div>
				</Content>
			</Layout>
		</Layout >
	);
}

export default PrinterPage;