import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { Layout, Drawer, FloatButton, Space, message, Divider } from 'antd';
import { DiffOutlined, SettingOutlined, ReloadOutlined } from '@ant-design/icons';

import openNewWindow from '../utils/window/newWindows';
import DatabaseService from '../utils/database/database';
import ChartConfiguration from '../components/chartConfig';
import PDFConfiguration from '../components/pdfConfig';

const SampleTable = dynamic(() => import('../components/sampleTable'), { ssr: true });
const DatabaseConfiguration = dynamic(() => import('../components/databaseConfig'), { ssr: true });

const { Content } = Layout;

const IndexPage = () => {
	const [open, setOpen] 						= useState<boolean>(false);
	const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
	const [comapreState, setCompareState]       = useState<boolean>(false);

	const onSelectChange = (idTest: number) => {
		let auxCopy = selectedRowKeys;
		if (auxCopy.includes(idTest)) {
			auxCopy.splice(auxCopy.indexOf(idTest), 1);
			setSelectedRowKeys(auxCopy);
		} else if (!selectedRowKeys.includes(idTest) && selectedRowKeys.length < 5) {
			auxCopy.push(idTest);
			setSelectedRowKeys(auxCopy);
		}

		setCompareState(selectedRowKeys.length > 1);
	};

	const rowSelection = { selectedRowKeys, onChange: onSelectChange };

	useEffect(() => { DatabaseService.ISCONNECTED().then((response) => { message.success(response); }).catch((error) => { message.error(error); }); }, []);

	return (
		<Layout style={{ background: "lightgrey", minHeight: "98vh", overflow: "auto" }}>
			<FloatButton tooltip="Abrir configuración" icon={<SettingOutlined />} onClick={() => { setOpen(true); }}/>
			{
				comapreState &&
					<FloatButton icon={<DiffOutlined />} tooltip="Comparar Pruebas" style={{ right: 120 }} 
						onClick={() => { openNewWindow("testsCompare", `Comparación de Pruebas: [${selectedRowKeys.toString()}]`, `/testsCompare?idSpecimens=${selectedRowKeys.toString()}`); }}
					/> 
			}
			<FloatButton icon={<ReloadOutlined />} tooltip="Refrescar Aplicación" style={{ right: 72 }} onClick={() => { DatabaseService.CONNECT(true); } }/>
			<Layout>
				<Content style={{ padding: '12px' }}>
					<div style={{ background: "white", padding: 24, borderRadius: 25 }} >
						<SampleTable rowSelection={rowSelection} />
					</div>
				</Content>
			</Layout>
			<Drawer title="Configuración" placement="right" footer={`E.A. Stanganelli - ${(new Date()).getFullYear()}`} onClose={() => { setOpen(false) }} open={open}>
				<Space direction='vertical' size={'small'}>
					<DatabaseConfiguration />
					<ChartConfiguration />
					<PDFConfiguration />
				</Space>
			</Drawer>
		</Layout>
	);
}

export default IndexPage;