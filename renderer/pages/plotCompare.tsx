import { useState, useEffect, FunctionComponent } from 'react';
import { useRouter } from 'next/router';
import { Layout, Typography, FloatButton } from 'antd';

import QueryService from '../utils/database/query';

import type { TestData } from '../interfaces/query';

const { Content } = Layout;
const testSample: FunctionComponent = () => {
    const { query, isReady } = useRouter();

    const [myTest, setMyTest] = useState<TestData>(null);

    useEffect((): void => {
        const id_specimen: number = Number(query['idSpecimen']) as number;
        if (isReady && id_specimen > 0) {
            QueryService.SELECT.TEST.Test([id_specimen]).then((data: TestData) => {
                setMyTest(data[0]);
            });
        }
    }, [isReady]);

    return (
        <Layout style={{ padding: '12px', minHeight: "98vh", overflow: "auto" }}>
            <Content style={{ padding: 24, background: 'white', borderRadius: 25, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: "1vw" }}>

            </Content>
        </Layout>
    );
}

export default testSample;