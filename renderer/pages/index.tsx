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
	const [open, setOpen] = useState<boolean>(false);
	let selectedRowKeys: number[] = [];

	useEffect(() => {
		DatabaseService.ISCONNECTED().then((response) => {
			message.success('Conectado a la Base de Datos');
		}).catch((error) => {
			message.error('Error al conectar a la Base de Datos');
		});
	}, []);

	return (
		<Layout style={{ background: "lightgray", minHeight: "98vh", overflow: "auto" }}>
			<FloatButton
				tooltip="Abrir configuración"
				icon={<SettingOutlined />}
				onClick={() => { setOpen(true); }}
			/>
			<FloatButton
				icon={<DiffOutlined />}
				tooltip="Comparar Pruebas"
				style={{ right: 72 }}
				onClick={() => {
					console.log("Comparar pruebas", selectedRowKeys);
					openNewWindow("plotCompare", `Comparación de Pruebas: ${selectedRowKeys.toString()}`, `/plotCompare?idSpecimens=${selectedRowKeys.toString()}`);
				}}
			/>
			<Layout>
				<Content style={{ padding: '12px' }}>
					<div style={{ background: "white", padding: 24, borderRadius: 25 }} >
					<SampleTable selectedRowKeys={selectedRowKeys} />
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