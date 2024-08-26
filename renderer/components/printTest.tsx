import ReactPDFChart from 'react-pdf-charts';
import { FunctionComponent, useEffect, useState } from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { LineChart, Line, XAxis, YAxis, Label, Legend } from 'recharts';

import type { QueryData, QueryTest } from '../interfaces/query/data';
import QueryDataService from '../utils/database/query/data';

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

interface Props { idSpecimen: number; testNumber: number; plotParams: { interval: number; timeType: string; }; }

const PrinterPage: FunctionComponent<Props> = (Props: Props) => {
	const { idSpecimen, testNumber, plotParams } = Props;
    const [axisColors, setAxisColors] 		  = useState<{ pressureColor: string; temperatureColor: string; }>({ pressureColor: '#FF0000', temperatureColor: '#00FF00' });
    const [pdfConfig, setPDFConfig]			  = useState<{ companyName: string; }>({ companyName: 'None' });
	const [myTest, setMyTest] 				  = useState<QueryTest>();
	const [myData, setMyData] 				  = useState<QueryData[]>([]);

	const selectTimeType = (): string => {
        switch (plotParams['timeType']) {
            case 's': return 'Segundos';
            case 'm': return 'Minutos';
            case 'h': return 'Horas';
        }
    }
	
	const loadData = async () => {
		await QueryDataService.SELECT.Data(idSpecimen, plotParams['interval'], plotParams['timeType']).then(async(responseData: QueryData[]) => {
			setMyData(await responseData);
		}).catch((error) => { console.error(error); });
	};

	const loadTest = async () => {	
		await QueryDataService.SELECT.TEST.Test(idSpecimen).then(async (responseTest: any) => {
			setMyTest(await {...responseTest[0]});
		}).catch((error) => { console.error(error); });
	};

	useEffect(() => {
		if(myData.length === undefined || myData.length === 0) { loadData(); }
	}, [myData]);

	useEffect(() => {
		if(myTest === undefined) { loadTest(); }
	}, [myTest]);

    useEffect(() => {
        const storedConfig:    { pressureColor: string; temperatureColor: string; } = JSON.parse(localStorage.getItem('chartConfig'));
		const storedPDFConfig: { companyName: string; } = JSON.parse(localStorage.getItem('pdfConfig'));
        if (storedConfig) {
            setAxisColors({
				pressureColor: storedConfig.pressureColor,
				temperatureColor: storedConfig.temperatureColor
			});
        }
		if (storedPDFConfig) { setPDFConfig({ companyName: storedPDFConfig['companyName'] }); }
    }, []);

	return (
		<Document
			title    = {pdfConfig['companyName'] + ` - Reporte de la Prueba ${myTest?.idSpecimen} - ${(new Date()).toDateString()}`}
			subject  = {pdfConfig['companyName'] + ` - Reporte de la Prueba ${myTest?.idSpecimen} - ${(new Date()).toDateString()}`}
			producer = {pdfConfig['companyName']}
			author   = {pdfConfig['companyName']}
			creator  = {`${myTest?.operator}`}
		>
			<Page size='A4' style={styles.PDFStyle.page}>
				{/* Parte superior del informe */}
				<View style={styles.PDFStyle.section}>
					<Text style={{ margin: '0 auto 0 auto', fontSize: '30px' }}>{pdfConfig['companyName']}</Text>
					<Text style={{ margin: '0 auto 0 auto', fontSize: '24px', paddingTop: '10px', paddingBottom: '40px' }}>{`Reporte de la Prueba`}</Text>
					<View style={styles.Content.table}>
						<View style={styles.Content.row}>
							<Text style={[styles.Content.cell, cellPropiertes.length.small]}>{`ID Prueba`}</Text>
							<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.child]}>{myTest?.idSpecimen}</Text>
							<Text style={[styles.Content.cell, cellPropiertes.length.small]}>{`Nombre de la\nPrueba`}</Text>
							<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.child]}>{myTest?.testName}</Text>
						</View>
						<View style={styles.Content.row}>
							<Text style={[styles.Content.cell, cellPropiertes.length.small]}>{`Cantidad de\nEspecimenes`}</Text>
							<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.child]}>{myTest?.specimensCount < 2 ? 'Muestra' : 'Muestras'} {myTest?.specimensCount}</Text>
							<Text style={[styles.Content.cell, cellPropiertes.length.small]}>{`Estándar`}</Text>
							<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.child]}>{myTest?.standard}</Text>
						</View>
						<View style={styles.Content.row}>
							<Text style={[styles.Content.cell, cellPropiertes.length.small]}>{`Entorno`}</Text>
							<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.child]}>{myTest?.enviroment}</Text>
							<Text style={[styles.Content.cell, cellPropiertes.length.small]}>{`Tapa de Extremo`}</Text>
							<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.child]}>{myTest?.endCap}</Text>
						</View>
						<View style={styles.Content.row}>
							<Text style={[styles.Content.cell, cellPropiertes.length.small]}>{`Operador`}</Text>
							<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.child]}>{myTest?.operator}</Text>
							<Text style={[styles.Content.cell, cellPropiertes.length.small]}></Text>
							<Text style={[styles.Content.cell, cellPropiertes.length.medium]}></Text>
						</View>
					</View>

					{/* Parte superior del informe */}
					<View style={[styles.Content.table, { paddingTop: '40px' }]}>
						<View style={styles.Content.row}>
							<Text style={[styles.Content.cell, cellPropiertes.length.full, cellPropiertes.fullBorder]}>{`Prueba Nro: ${testNumber}`}</Text>
						</View>
						<View style={styles.Content.row}>
							<Text style={[styles.Content.cell, cellPropiertes.length.small, cellPropiertes.fullBorder]}>{`Material`}</Text>
							<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.fullBorder]}>{myTest?.material}</Text>
							<Text style={[styles.Content.cell, cellPropiertes.length.small, cellPropiertes.fullBorder]}>{`Especificación`}</Text>
							<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.fullBorder]}>{myTest?.specification}</Text>
						</View>
						<View style={styles.Content.row}>
							<Text style={[styles.Content.cell, cellPropiertes.length.small, cellPropiertes.fullBorder]}>{`Diámetro Real [mm]`}</Text>
							<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.fullBorder]}>{myTest?.diameterReal}</Text>
							<Text style={[styles.Content.cell, cellPropiertes.length.small, cellPropiertes.fullBorder]}>{`Diámetro Normal [mm]`}</Text>
							<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.fullBorder]}>{myTest?.diameterNominal}</Text>
						</View>
						<View style={styles.Content.row}>
							<Text style={[styles.Content.cell, cellPropiertes.length.small, cellPropiertes.fullBorder]}>{`Longitud Libre [mm]`}</Text>
							<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.fullBorder]}>{myTest?.lengthFree}</Text>
							<Text style={[styles.Content.cell, cellPropiertes.length.small, cellPropiertes.fullBorder]}>{`Longitud Total [mm]`}</Text>
							<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.fullBorder]}>{myTest?.lengthTotal}</Text>
						</View>
						<View style={styles.Content.row}>
							<Text style={[styles.Content.cell, cellPropiertes.length.small, cellPropiertes.fullBorder]}>{`Tiempo de\nPrueba`}</Text>
							<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.fullBorder]}>{myTest?.duration}</Text>
							<Text style={[styles.Content.cell, cellPropiertes.length.small, cellPropiertes.fullBorder]}>{`Temperatura [C]`}</Text>
							<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.fullBorder]}>{myTest?.targetTemperature}</Text>
						</View>
						<View style={styles.Content.row}>
							<Text style={[styles.Content.cell, cellPropiertes.length.small, cellPropiertes.fullBorder]}>{`Grosor Pared [mm]`}</Text>
							<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.fullBorder]}>{myTest?.wallThickness}</Text>
							<Text style={[styles.Content.cell, cellPropiertes.length.small, cellPropiertes.fullBorder]}>{`Período de\nCondicionamiento`}</Text>
							<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.fullBorder]}>{myTest?.conditionalPeriod}</Text>
						</View>
						<View style={styles.Content.row}>
							<Text style={[styles.Content.cell, cellPropiertes.length.small, cellPropiertes.fullBorder]}>{`Hoop Stress [Bar]`}</Text>
							<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.fullBorder]}>{``}</Text>
							<Text style={[styles.Content.cell, cellPropiertes.length.small, cellPropiertes.fullBorder]}>{`Presión [Bar]`}</Text>
							<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.fullBorder]}>{myTest?.targetPressure}</Text>
						</View>
						<View style={styles.Content.row}>
							<Text style={[styles.Content.cell, cellPropiertes.length.small, cellPropiertes.fullBorder]}>{`Fecha de\nInicio`}</Text>
							<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.fullBorder]}>{myTest?.beginTime}</Text>
							<Text style={[styles.Content.cell, cellPropiertes.length.small, cellPropiertes.fullBorder]}>{`Fecha de\nFinalización`}</Text>
							<Text style={[styles.Content.cell, cellPropiertes.length.medium, cellPropiertes.fullBorder]}>{myTest?.endTime}</Text>
						</View>
						<View style={styles.Content.row}>
							<Text style={[styles.Content.cell, cellPropiertes.length.small, cellPropiertes.fullBorder]}>{`Tipo de Falla`}</Text>
							<Text style={[styles.Content.cell, cellPropiertes.length.third, cellPropiertes.fullBorder]}>{myTest?.failText}</Text>
						</View>
						<View style={styles.Content.row}>
							<Text style={[styles.Content.cell, cellPropiertes.length.small, cellPropiertes.fullBorder]}>{`Observaciones`}</Text>
							<Text style={[styles.Content.cell, cellPropiertes.length.third, cellPropiertes.fullBorder]}>{myTest?.remark}</Text>
						</View>
					</View>
				</View>
			</Page>
			<Page size='A4' style={styles.PDFStyle.page}>
				<View style={styles.PDFStyle.section}>
					<ReactPDFChart style={{marginLeft: -12.5, marginTop: 50}}>
						<LineChart data={myData} height={300} width={500}>
							<Legend verticalAlign="bottom"/>
							<XAxis dataKey="key"><Label value={`Tiempo [${selectTimeType()}]`} offset={0} position="insideBottom" /></XAxis>
							<YAxis yAxisId="left"                      domain={['auto', 'auto']}/>
							<YAxis yAxisId="right" orientation='right' domain={['auto', 'auto']}/>
							<Line yAxisId="left"  type="monotone" dataKey="pressure"    name="Presión"     scale='identity' stroke={axisColors['pressureColor']}    dot={false} isAnimationActive={false} />
							<Line yAxisId="right" type="monotone" dataKey="temperature" name="Temperatura" scale='identity' stroke={axisColors['temperatureColor']} dot={false} isAnimationActive={false} />
						</LineChart>
					</ReactPDFChart>
				</View>
			</Page>
		</Document>
	);
}

export default PrinterPage;