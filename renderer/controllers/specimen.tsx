import { Flex, Layout, Button, Typography } from 'antd';

const { Header, Content } = Layout;
const { Title } = Typography;

export interface specimen {
    idSpecimen: number;
    operator: string;
    initDate: string;
    endDate: string;
};

export class specimen {
    idSpecimen: number;
    operator: string;
    initDate: string;
    endDate: string;

    constructor() {
        //...
    }

    static render() {
        const headerStyle: React.CSSProperties = {
            textAlign: 'center',
            color: 'black',
            // height: 80,
            // paddingInline: 48,
            // lineHeight: 'auto',
            backgroundColor: 'white',
        };

        const action = () => {
            console.log("Hello from render modal");
        };

        return (
            <div>
                <Button onClick={action}>Imprimir</Button>
                <Flex vertical={true}>
                    <Header style={headerStyle}>
                        <Title>STEL</Title>
                        <Title level={3}>Informe</Title>
                    </Header>
                    <Layout>
                        <Content>Información para el informe</Content>
                        <Content>Gráfico</Content>
                    </Layout>
                </Flex>
            </div>
        );
    }

    linechart() {
        return (<p>some contents...</p>);
    }
}