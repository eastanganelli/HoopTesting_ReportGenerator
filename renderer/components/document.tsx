import { FunctionComponent } from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

import type { TestSampleValue, TestSpecimenValue, TestDataValues } from '../interfaces/query';

interface Props {
    DataSample: TestSampleValue;
    DataSpecimen: TestSpecimenValue;
    DataPlot: TestDataValues[];
};

const DocumentRender: FunctionComponent<Props> = ({ DataSample, DataSpecimen, DataPlot }: Props) => {
    const styles = StyleSheet.create({
        page: {
            height: '100vh',
            flexDirection: 'row',
            backgroundColor: '#E4E4E4'
        },
        section: {
            margin: 10,
            padding: 10,
            flexGrow: 1
        }
    });
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text>Section #1</Text>
                </View>
                <View style={styles.section}>
                    <Text>Section #2</Text>
                </View>
            </Page>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text>Section #1</Text>
                </View>
                <View style={styles.section}>
                    <Text>Section #2</Text>
                </View>
            </Page>
        </Document>
    );
};

export default DocumentRender;