import dynamic from 'next/dynamic';
import ReactPDFChart from 'react-pdf-charts';
import { useRouter } from 'next/router';
import { FunctionComponent, useEffect, useState } from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { LineChart, Line, XAxis, YAxis, Label } from 'recharts';
import { Layout } from 'antd';
const PDFViewer = dynamic(() => import('@react-pdf/renderer').then((mod) => mod.PDFViewer), { ssr: false });

import QueryService from '../utils/database/dbquery';

import type { TestData, TestDataValues } from '../interfaces/query';

const { Content } = Layout;

const styles = StyleSheet.create({
	page: {
		height: '100vh',
		// backgroundColor: '#E4E4E4'
	},
	section: {
		margin: '25mm 19.1mm 25mm 19.1mm',
		// backgroundColor: 'white'
	},
	table: { display: 'flex', flexDirection: 'column', fontSize: '10px' },
	row: { flexDirection: 'row' },
	cell: { flex: 1, justifyContent: 'center', textAlign: 'left', width: '30mm', padding: 4 },
	cellBorder: { flex: 1, justifyContent: 'center', textAlign: 'left', width: '55.9mm', padding: 4, borderBottom: '1 solid black' },
});

const PrinterPage: FunctionComponent = () => {
	const { query, isReady } = useRouter();
	const [myTest, setMyTest] = useState<TestData>(null);
	const [myData, setMyData] = useState<TestDataValues[]>(null);
	const [hoursInSeconds, setHoursInSeconds] = useState<number[]>(null);

	const MyDocument = () => {
		return (
			<Document
				title={`STEL S.A. - Reporte de la Prueba ${myTest?.mySpecimen?.idSpecimen} - ${(new Date()).toDateString()}`}
				subject={`STEL S.A. - Reporte de la Prueba ${myTest?.mySpecimen?.idSpecimen} - ${(new Date()).toDateString()}`}
				producer='STEL S.A.'
				author='STEL S.A.'
				creator={`${myTest?.mySpecimen?.operator}`}
			>
				<Page size='A4' style={styles.page}>
					<View style={styles.section}>
						<Text style={{ margin: '0 auto 0 auto', fontSize: '30px' }}>STEL S.A.</Text>
						<Text style={{ margin: '0 auto 0 auto', fontSize: '24px', paddingTop: '10px', paddingBottom: '20px' }}>Reporte de la Prueba</Text>
						<View style={styles.table}>
							<View style={styles.row}>
								<Text style={styles.cell}>ID Prueba</Text>
								<Text style={styles.cellBorder}>{myTest?.mySpecimen?.idSpecimen}</Text>
								<Text style={styles.cell}>Nombre de la prueba</Text>
								<Text style={styles.cellBorder}>{myTest?.mySpecimen?.testName}</Text>
							</View>
							<View style={styles.row}>
								<Text style={styles.cell}>{`Cantidad de\nespecimenes`}</Text>
								<Text style={styles.cellBorder}>{myTest?.mySpecimen?.counts < 2 ? 'Muestra' : 'Muestras'} {myTest?.mySpecimen?.counts}</Text>
								<Text style={styles.cell}>Estándar</Text>
								<Text style={styles.cellBorder}>{myTest?.mySample?.standard}</Text>
							</View>
							<View style={styles.row}>
								<Text style={styles.cell}>Entorno</Text>
								<Text style={styles.cellBorder}>{myTest?.mySpecimen?.enviroment}</Text>
								<Text style={styles.cell}>Tapa de Extremo</Text>
								<Text style={styles.cellBorder}>{myTest?.mySpecimen?.endCap}</Text>
							</View>
							<View style={styles.row}>
								<Text style={styles.cell}>Operador</Text>
								<Text style={styles.cellBorder}>{myTest?.mySpecimen?.operator}</Text>
								<Text style={styles.cell}></Text>
								<Text style={styles.cell}></Text>
							</View>
						</View>

					</View>
				</Page>
				<Page size='A4' style={styles.page}>
					<View style={styles.section}>
						<Text style={{ margin: '0 auto 0 auto', fontSize: '13px' }}><Text style={{ color: "#8884d8" }}>Presión</Text><Text>    </Text><Text style={{ color: "#82ca9d" }}>Temperatura</Text></Text>
						<ReactPDFChart>
							<LineChart data={myData} height={350} width={525} margin={{ top: 15, right: 0, bottom: 0, left: -40 }}>
								<XAxis dataKey="key" ticks={hoursInSeconds} tickFormatter={(tick) => `${tick / 3600}`}>
									<Label value="Tiempo [Hora]" offset={1.5} />
								</XAxis>
								<YAxis yAxisId="left" dataKey="pressure" label={{ value: "Presión [Bar]", viewBox: { x: 85, y: 13 }, position: 'insideTopLeft' }} />
								<YAxis yAxisId="right" dataKey="temperature" orientation="right" label={{ value: "Temperature [°C]", viewBox: { x: 475, y: 13 }, position: 'insideTopLeft' }} />
								<Line yAxisId="left" type="monotone" dataKey="pressure" name="Presión" stroke="#8884d8" scale='identity' dot={false} isAnimationActive={false} />
								<Line yAxisId="right" type="monotone" dataKey="temperature" name="Temperatura" scale='identity' stroke="#82ca9d" dot={false} isAnimationActive={false} />
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
						<PDFViewer
							style={{ width: "100%", height: '90.5vh', borderRadius: 25 }}
						>
							{MyDocument()}
						</PDFViewer>
					</div>
				</Content>
			</Layout>
		</Layout >
	);
}

export default PrinterPage;