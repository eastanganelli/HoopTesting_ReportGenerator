import React, { useState } from 'react'
<<<<<<< HEAD
import { Layout, Table, Space, Button } from 'antd'
import type { TableColumnsType } from 'antd'

import TestModal from './testmodal'
=======
import { Layout, Table, Modal, Space, Button, Row } from 'antd'
import type { TableColumnsType } from 'antd'

import { specimen } from '../controllers/specimen'
>>>>>>> 1ddf3d59cb00f8613d7b5f88de5e5c1bb45216f4

const { Content } = Layout;

interface DataType {
	key: React.Key;
	idsample: number;
	standard: string;
	material: string;
	upgradeNum: number;
}

interface ExpandedDataType {
	key: React.Key;
	idspecimen: number;
	init: string;
	end: string;
	operator: string;
}

const HomePage: React.FC = () => {
<<<<<<< HEAD
	const [openModal, setOpenModal] = React.useState(false);
  const btnclicked = (e: any, bla: any) => {
    setOpenModal(true);
=======
	const { confirm } = Modal;
	
	const btnclicked = async (e: any, bla: any) => {
		confirm({
			title: 'Muestra [] - Especimen []',
			content: specimen.render(),
			width: window.innerWidth,
			okText: 'Imprimir',
			cancelText: 'Cerrar',
			onOk() {
			  console.log('Imprimiendo');
			},
			onCancel() {
			  console.log('Cerrado');
			},
		  });
>>>>>>> 1ddf3d59cb00f8613d7b5f88de5e5c1bb45216f4
	}
	const expandedRowRender = () => {
		const columns: TableColumnsType<ExpandedDataType> = [
			{ title: 'ID Specimen', dataIndex: 'idspecimen', key: 'idspecimen' },
			{ title: 'Inicio', dataIndex: 'init', key: 'init' },
			{ title: 'Fin', dataIndex: 'end', key: 'end' },
			{ title: 'Operador', dataIndex: 'operator', key: 'operator' },
			{
				title: 'Accion',
				dataIndex: 'actions',
				key: 'actions',
				render: (text, record, index) => (
					<Space size="middle">
						<Button onClick={(event) => btnclicked(event, record)} type="primary">Ver</Button>
						<Button onClick={(event) => btnclicked(event, record)} type="primary">Eliminar</Button>
<<<<<<< HEAD
            { openModal ? TestModal( "", window.innerWidth) : null }
=======
>>>>>>> 1ddf3d59cb00f8613d7b5f88de5e5c1bb45216f4
					</Space>
				)
			}
		];

		const data = [];
		for (let i = 0; i < 3; ++i) {
			data.push({
				key: i,
				idspecimen: i,
				init: '2014-12-24 23:12:00',
				end: 'This is production name',
				operator: 'Upgraded: 56',
			});
		}
		return <Table columns={columns} dataSource={data} pagination={false} />;
	};

	const columns: TableColumnsType<DataType> = [
		{ title: 'ID Sample', dataIndex: 'idsample', key: 'idsample' },
		{ title: 'Standard', dataIndex: 'standard', key: 'standard' },
		{ title: 'Material', dataIndex: 'material', key: 'material' },
		{ title: 'Upgraded', dataIndex: 'upgradeNum', key: 'upgradeNum' }
	];

	const data: DataType[] = [];
	for (let i = 1; i <= 1; ++i) {
		data.push({
			key: i,
			idsample: i,
			standard: 'Screen',
			material: 'iOS',
			upgradeNum: 500
		});
	}

	return (
		<Layout style={{ height: "100vh", background: "lightgray" }}>
			<Layout>
				<Content style={{ padding: '10px' }}>
					<div style={{ background: "white", padding: 24, borderRadius: 25 }} >
						<Table
							columns={columns}
							expandable={{ expandedRowRender }}
							dataSource={data}
						/>
					</div>
				</Content>
			</Layout>
		</Layout>
	)
}

export default HomePage;