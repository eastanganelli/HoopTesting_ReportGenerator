import { useState } from 'react';
import { Layout, Drawer, FloatButton, Space, Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic';

const SampleTable = dynamic(() => import('../components/sampleTable'));

const { Content } = Layout;

const IndexPage = () => {
	const [open, setOpen] = useState<boolean>(false);
	return (
		<Layout style={{ background: "lightgray", minHeight: "98vh", overflow: "auto" }}>
			<FloatButton
				tooltip="Abrir configuración"
				icon={<SettingOutlined/>}
				onClick={() => {
					setOpen(true);
					console.log("Configuration zone opening");
				}}
			>

			</FloatButton>
			<Layout>
				<Content style={{ padding: '12px' }}>
					<div style={{ background: "white", padding: 24, borderRadius: 25 }} >
						<SampleTable />
					</div>
				</Content>
			</Layout>
			<Drawer
				title="Configuración"
				placement="right"
				footer="E.A. Stanganelli 2024"
				//size={450}
				onClose={() => { setOpen(false) }}
				open={open}
				extra={
					<Space>
						<Button type="primary" onClick={() => { setOpen(false) }}>Guardar</Button>
					</Space>
				}
			/>
		</Layout >
	);
}

export default IndexPage;