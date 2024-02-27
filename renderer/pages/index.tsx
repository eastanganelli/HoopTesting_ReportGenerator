import { useEffect } from 'react';
import { Layout, Button } from 'antd';
import { openNewWindow } from '../utils/newWindows';

import SampleTable from '../components/sampleTable';

const { Content } = Layout;

const IndexPage = () => {
	useEffect(() => {
		if (global && global.ipcRenderer) {
			global.ipcRenderer.addListener('message', (_event, args) => { alert(args); });
		}
	}, []);

	return (
		<Layout style={{ height: "100vh", background: "lightgray" }}>
			<Layout>
				<Content style={{ padding: '10px' }}>
					<div style={{ background: "white", padding: 24, borderRadius: 25 }} >
						<SampleTable />
					</div>
				</Content>
			</Layout>
		</Layout>
	)
}

export default IndexPage
