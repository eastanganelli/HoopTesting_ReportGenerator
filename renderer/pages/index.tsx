import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Layout, Drawer, FloatButton, Space, Button } from 'antd';
import { DiffOutlined, SettingOutlined } from '@ant-design/icons';
const SampleTable = dynamic(() => import('../components/sampleTable'), { ssr: true });

const { Content } = Layout;

const IndexPage = () => {
	const [open, setOpen] = useState<boolean>(false);
	let selectedRowKeys: number[] = [];

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
				onClick={() => { console.log("Comparar pruebas", selectedRowKeys); }}
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
				extra={
					<Space>
						<Button type="primary" onClick={() => { setOpen(false) }}>Guardar</Button>
					</Space>
				}
			/>
		</Layout>
	);
}

export default IndexPage;