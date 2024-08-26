import dynamic from 'next/dynamic';
import { FunctionComponent, useEffect, useState } from 'react';
import { Form, FormInstance, Row, Col, Input, InputNumber, Checkbox, Divider, Select, AutoComplete } from 'antd';
const PlotTestResult = dynamic(() => import('./testPlot'), { ssr: false });

import QueryDataService   from '../utils/database/query/data';
import QueryStaticService from '../utils/database/query/static';

import type { QueryTest }                    from '../interfaces/query/data';
import type { QueryStandard, QueryOperator } from '../interfaces/query/static';

const { Option } = Select;

interface Props { myTestForm: FormInstance<QueryTest>; idSpecimen: number; }

const testInformation: FunctionComponent<Props> = (Props: Props) => {
    const { myTestForm, idSpecimen }  = Props;
    const [plotForm]                  = Form.useForm();
    const [reRender, setReRender]     = useState<number>(0);
    const [editable, setEditable]     = useState<boolean>(true);
    const [myStandards, setMyStandards] = useState<QueryStandard[]>([]);
    const [selectedStandard, setSelectedStandard] = useState<QueryStandard>();
    const [operatorsOptions, setOperatorsOptions] = useState<{ value: string }[]>([]);
    const [standardsOptions, setStandardsOptions] = useState<{ value: string }[]>([]);
    const [materialsOptions, setMaterialsOptions] = useState<{ value: string }[]>([]);
    const [specificationsOptions, setSpecificationsOptions] = useState<{ value: string }[]>([]);
    const [endCapsOptions,               setEndCapsOptions] = useState<{ value: string }[]>([]);
    const [enviromentsOptions,       setEnviromentsOptions] = useState<{ value: string }[]>([]);
    const [testTypesOptions,           setTestTypesOptions] = useState<{ value: string }[]>([]);

    const filterHandler = (inputValue: any, option: any) => { return option!.value?.toUpperCase().indexOf(inputValue?.toUpperCase()) !== -1 };
    const cleanOptions = () => { setSpecificationsOptions([]); setEndCapsOptions([]); setEnviromentsOptions([]); setTestTypesOptions([]); };

    const optionHandler = {
        standard: () => {
            for(let standard of myStandards) {
                if (standard['standard'] === myTestForm.getFieldValue('standard')) {
                    cleanOptions();
                    let auxMaterials:   { value: string }[] = [],
                        auxEndCaps:     { value: string }[] = [],
                        auxEnviroments: { value: string }[] = [],
                        auxTestTypes:   { value: string }[] = [];
                    for(let material of standard?.materials) {
                        auxMaterials.push({ value: material['material'] });
                        setMaterialsOptions([...auxMaterials]);
                    }
                    for(let endCap of standard?.endcaps) {
                        auxEndCaps.push({ value: endCap['endcap'] });
                        setEndCapsOptions([...auxEndCaps]);
                    }
                    for(let enviroment of standard?.enviroments) {
                        auxEnviroments.push({ value: enviroment['insideFluid'] });
                        setEnviromentsOptions([...auxEnviroments]);
                    }
                    for(let testType of standard?.testtypes) {
                        auxTestTypes.push({ value: testType['testtype'] });
                        setTestTypesOptions([...auxTestTypes]);
                    }
                    if(myTestForm.getFieldValue('material') !== '') {
                        setSpecificationsOptions([]);
                        let auxSpecifications: { value: string }[] = [];
                        for(let material of standard?.materials) {
                            if(material['material'] === myTestForm.getFieldValue('material')) {
                                for(let specification of material?.specifications) {
                                    auxSpecifications.push({ value: specification['specification'] });
                                }
                                setSpecificationsOptions([...auxSpecifications]);
                                break;
                            }
                        }
                    }
                    setSelectedStandard({...standard});
                    break;
                }
            };
        },
        material: () => {
            if(selectedStandard !== undefined) {
                setSpecificationsOptions([]);
                let auxSpecifications: { value: string }[] = [];
                for(let material of selectedStandard.materials) {
                    if(material['material'] === myTestForm.getFieldValue('material')) {
                        for(let specification of material['specifications']) {
                            auxSpecifications.push({ value: specification['specification'] });
                        }
                        setSpecificationsOptions([...auxSpecifications]);
                        break;
                    }
                }
            }
        },
        conditionalPeriod: (myDiameter: any) => {
            if(selectedStandard !== undefined) {
                for(let conditionalPeriod of selectedStandard?.conditionalperiods) {
                    if(conditionalPeriod['minwall'] <= myDiameter && myDiameter < conditionalPeriod['maxwall']) {
                        myTestForm.setFieldsValue({conditionalPeriod: conditionalPeriod['condPeriod']});
                    }
                }
            }
        }
    };

    const selectFromStatic = () => {
        if(myStandards.length === 0 || myStandards === undefined) { setReRender(reRender + 1); }
        else { optionHandler.standard(); }
    };

    const loadModalData = async () => {
        await QueryStaticService.SELECT.Standards().then(async (responseStandards) => {
            setMyStandards(await responseStandards[0]['standards']);
            let auxStandards: { value: string }[] = [];
            for(let standard of await responseStandards[0]['standards']) {
                auxStandards.push({ value: standard['standard'] });
            }
            setStandardsOptions([...auxStandards]);
        }).catch((error) => { console.error('Error', error); });
        await QueryStaticService.SELECT.Operators().then(async(responseOperators) => {
            let auxOperators: { value: string }[] = [];
            for(let operator of await responseOperators) {
                auxOperators.push({ value: operator['operator'] });
            }
            setOperatorsOptions([...auxOperators]);
        }).catch((error) => { console.error('Error', error); });
        await QueryDataService.SELECT.TEST.Test(idSpecimen).then(async(responseTest) => {
            myTestForm.setFieldsValue(await {...responseTest[0]});
        });
    };

    useEffect(() => {
        loadModalData();
    }, [editable, selectedStandard, materialsOptions, specificationsOptions, endCapsOptions, enviromentsOptions, testTypesOptions]);

    return (
        <>  
            <Checkbox checked={editable} onChange={(e) => { setEditable(e.target.checked); if(!e.target.checked) { selectFromStatic(); } }}>{`Editar Prueba`}</Checkbox>
            <Form form={myTestForm} layout='horizontal' disabled={editable}>
                <Row gutter={[8, 8]}>
                    <Col span={16}><Form.Item label="Nombre de la Prueba" name='testName'><AutoComplete options={testTypesOptions} filterOption={filterHandler}/></Form.Item></Col>
                    <Col span={8}><Form.Item  label="Operador"            name='operator'><AutoComplete options={operatorsOptions} filterOption={filterHandler}/></Form.Item></Col>
                    {/* Sample Information */}
                    <Col span={8}><Form.Item label="Estándar"       name='standard'><AutoComplete      options={standardsOptions}      filterOption={filterHandler} onChange={optionHandler.standard}/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Material"       name='material'><AutoComplete      options={materialsOptions}      filterOption={filterHandler} onChange={optionHandler.material}/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Especificación" name='specification'><AutoComplete options={specificationsOptions} filterOption={filterHandler}/></Form.Item></Col>
                    {/* Eviroment */}
                    <Col span={8}><Form.Item label="Tapa de Extremo"         name='endCap'><AutoComplete     options={endCapsOptions}     filterOption={filterHandler}/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Entorno"                 name='enviroment'><AutoComplete options={enviromentsOptions} filterOption={filterHandler}/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Cantidad de Especimenes" name='specimensCount'><InputNumber disabled/></Form.Item></Col>
                    {/* Target Data */}
                    <Col span={8}><Form.Item label="Hoop Stress"><Input type='text'                    addonAfter={'Bar'} disabled/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Presión"     name='targetPressure'><InputNumber    addonAfter={'Bar'}/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Temperatura" name='targetTemperature'><InputNumber addonAfter={'°C'}/></Form.Item></Col>
                    {/* Length */}
                    <Col span={8}><Form.Item label="Longitud Total"              name='lengthTotal'><InputNumber addonAfter={'mm'}/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Longitud Libre"              name='lengthFree'><InputNumber  addonAfter={'mm'}/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Período de Condicionamiento" name='conditionalPeriod'><Input type='text' disabled/></Form.Item></Col>
                    {/* Diameter */}
                    <Col span={8}><Form.Item label="Diámetro Nominal" name='diameterNominal'><InputNumber addonAfter={'mm'}/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Diámetro Real"    name='diameterReal'><InputNumber    addonAfter={'mm'} onChange={optionHandler.conditionalPeriod}/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Grosor Pared"     name='wallThickness'><InputNumber   addonAfter={'mm'}/></Form.Item></Col>
                    {/* Time */}
                    <Col span={8}><Form.Item label="Fecha de Inicio"       name='beginTime'><Input type='text' disabled/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Fecha de Finalización" name='endTime'><Input   type='text' disabled/></Form.Item></Col>
                    <Col span={8}><Form.Item label="Tiempo de Prueba"      name='duration'><InputNumber disabled/></Form.Item></Col>
                    {/* State Information */}
                    <Col span={24}><Form.Item label="Tipo de Falla" name='failText'><Input type='text'/></Form.Item></Col>
                    <Col span={24}><Form.Item label="Observación"   name='remark'><Input   type='text'/></Form.Item></Col>
                </Row>
            </Form>
            <Divider/>
            <PlotTestResult idSpecimen={idSpecimen} plotForm={plotForm}/>
        </>
    );
}
export default testInformation;