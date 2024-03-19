import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { Layout, Drawer, FloatButton, Space, Button, message } from 'antd';
import { DiffOutlined, SettingOutlined } from '@ant-design/icons';

import openNewWindow from '../utils/newWindows';
import DatabaseService from '../utils/database/database';

const SampleTable = dynamic(() => import('../components/sampleTable'), { ssr: true });
const DatabaseConfiguration = dynamic(() => import('../components/databaseConfig'), { ssr: true });

const { Content } = Layout;

const IndexPage = () => {
	const [comapreState, setCompareState] = useState<boolean>(false);
	const [open, setOpen] = useState<boolean>(false);
	const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

	const onSelectChange = (idTest: number) => {
		let auxCopy: number[] = selectedRowKeys;
		if (auxCopy.includes(idTest)) {
			auxCopy.splice(auxCopy.indexOf(idTest), 1);
			setSelectedRowKeys(auxCopy);
		} else if (!selectedRowKeys.includes(idTest) && selectedRowKeys.length < 5) {
			auxCopy.push(idTest);
			setSelectedRowKeys(auxCopy);
		}

		if (selectedRowKeys.length > 1) { setCompareState(true); }
		else { setCompareState(false); }
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange
	};

	useEffect(() => {
		DatabaseService.ISCONNECTED().then((response) => { message.success('Conectado a la Base de Datos'); }).catch((error) => { message.error('Error al conectar a la Base de Datos'); });
	}, []);

	return (
		<Layout style={{ background: "lightgrey", minHeight: "98vh", overflow: "auto" }}>
			<FloatButton
				tooltip="Abrir configuración"
				icon={<SettingOutlined />}
				onClick={() => { setOpen(true); }}
			/>
			{
				comapreState &&
					<FloatButton
						icon={<DiffOutlined />}
						tooltip="Comparar Pruebas"
						style={{ right: 72 }} 
						onClick={() => { openNewWindow("testsCompare", `Comparación de Pruebas: ${selectedRowKeys.toString()}`, `/testsCompare?idSpecimens=${selectedRowKeys.toString()}`); }}
					/>
			}
			<Layout>
				<Content style={{ padding: '12px' }}>
					<div style={{ background: "white", padding: 24, borderRadius: 25 }} >
						<SampleTable rowSelection={rowSelection} />
					</div>
				</Content>
			</Layout>
			<Drawer
				title="Configuración"
				placement="right"
				footer={`E.A. Stanganelli - ${(new Date()).getFullYear()}`}
				/* size={450} */
				onClose={() => { setOpen(false) }}
				open={open}
			>
				<Space>
					<DatabaseConfiguration />
				</Space>
			</Drawer>
		</Layout>
	);
}

export default IndexPage;