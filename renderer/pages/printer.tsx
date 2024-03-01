import { Layout } from 'antd';
import dynamic from 'next/dynamic';

// import { PDFViewer } from '@react-pdf/renderer';
/* const PDFViewer = dynamic(() => import('@react-pdf/renderer').then((mod) => mod.PDFViewer), { ssr: false });
const DocumentRender = dynamic(() => import('../components/document'), { ssr: false }); */
// import DocumentRender from '../components/document';
/* import ReactPDFChart from "react-pdf-charts"; */

const { Content } = Layout;

const PrinterPage = () => {
	return (
		<Layout style={{ height: "100vh", background: "lightgray" }}>
			<Layout>
				<Content style={{ padding: '10px' }}>
					<div style={{ background: "white", padding: 24, borderRadius: 25 }} >
					{/* <PDFViewer style={{ width: "100%", height: "100vh" }}>
						<DocumentRender />
					</PDFViewer> */}
					{/* <ReactPDFChart> */}

					{/* </ReactPDFChart> */}
					</div>
				</Content>
			</Layout>
		</Layout>
	);
}

export default PrinterPage;