import { Layout } from 'antd';
import dynamic from 'next/dynamic';

const SampleTable = dynamic(() => import('../components/sampleTable'));

const { Content } = Layout;

const IndexPage = () => {
	return (
		<Layout style={{ background: "lightgray", minHeight: "98vh", overflow: "auto" }}>
			<Layout>
				<Content style={{ padding: '12px' }}>
					<div style={{ background: "white", padding: 24, borderRadius: 25 }} >
						<SampleTable />
					</div>
				</Content>
			</Layout>
		</Layout>
	);
}

export default IndexPage;