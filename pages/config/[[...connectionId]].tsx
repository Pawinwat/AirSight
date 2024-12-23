import { AxiosRequestHeaders } from 'axios';
import { FormikHelpers, useFormik } from 'formik';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Panel } from 'primereact/panel';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef } from 'react';
import { useConnection, useTestConnection } from 'src/api/local/airsight/hooks';
import StatusCard from 'src/components/connection/StatusCard';
import { CARD_GAP } from 'src/components/layout/constants';
import { PATH } from 'src/routes';
import { InstanceStatus } from 'src/types/airflow';
import { ConnectionData } from 'src/types/db';
import * as Yup from 'yup';

const AirflowConnectionForm: React.FC = () => {
    const toast = useRef<Toast>(null);
    const router = useRouter();
    const { query } = router;
    const { connectionId } = query;
    const connection = useConnection({
        connectionId: connectionId as string,
    });
    const testConnection = useTestConnection()

    const initialValues: Partial<ConnectionData> = {
        connection_id: '',
        name: '',
        ui_url: '',
        api_url: '',
        header: '',
        username: '',
        password: '',
    };

    const validationSchema = Yup.object({
        connection_id: Yup.string().optional(),
        name: Yup.string().required('Name is required'),
        ui_url: Yup.string().url('Invalid URL format')?.optional()?.nullable(),
        api_url: Yup.string().url('Invalid URL format').required('API URL is required'),
        header: Yup.object(),
        // .test('is-json', 'Header must be a valid JSON', (value) => {
        //     if (!value) return true;
        //     try {
        //         JSON.parse(value);
        //         return true;
        //     } catch (e) {
        //         return false;
        //     }
        // }),
        username: Yup.string(),
        password: Yup.string(),
    });



    const onSubmit = (_values: Partial<ConnectionData>, helpers: FormikHelpers<Partial<ConnectionData>>) => {
        // const headerObject = values.header ? JSON.parse(values.header as string) : {};
        // if (values.username && values.password) {
        //     headerObject.Authorization = `Basic ${btoa(`${values.username}:${values.password}`)}`;
        // }
        // console.log('Form Data', { ...values, header: headerObject });
        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Connection registered successfully!' });
        helpers.setSubmitting(false);
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
    });

    useEffect(() => {
        if (connection.isSuccess) {
            formik.setValues({
                ...connection?.data,
                // header:JSON.stringify(connection?.data?.header)
            } as ConnectionData);


        }
    }, [connection?.isFetching]);

    useEffect(() => {
        connection.isSuccess && handleTest()
    }, [formik?.dirty, connection?.isFetching])

    const isLoading = connection.isFetching || testConnection?.isPending


    const handleTest = () => {
        if (!formik.values?.api_url) return;
        testConnection.mutate({
            config: {
                baseURL: (formik.values.api_url as string),
                headers: formik.values.header as AxiosRequestHeaders
            }
        })
    };
    const canTest = !!formik?.values?.api_url
    const testIcon = testConnection?.isPending
        ? 'pi pi-spin pi-spinner'
        : testConnection?.isSuccess
            ? 'pi pi-check'
            : testConnection?.isError
                ? 'pi pi-times'
                : '';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="p-fluid"
        >
            <Toast ref={toast} />
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: CARD_GAP
                }}>

                <form
                    style={{
                        width: '50%',
                    }}
                    onSubmit={formik.handleSubmit}
                >

                    <Panel
                        header="Register Airflow Connection"

                        icons={<>
                            {/* <Button onClick={handleTest} label="Test Connection" icon={testIcon} size='small' disabled={isLoading} /> */}
                            {/* <Button type="submit" label="Register" className="p-mt-2" disabled={isLoading} /> */}

                        </>}
                    >
                        <div className="p-formframe">
                            <div className="p-field">
                                <label htmlFor="connection_id">Connection ID</label>
                                <InputText
                                    id="connection_id"
                                    name="connection_id"
                                    value={formik.values.connection_id}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={formik.touched.connection_id && formik.errors.connection_id ? 'p-invalid' : ''}
                                    readOnly
                                    disabled={true}
                                />
                                {formik.touched.connection_id && formik.errors.connection_id && (
                                    <small className="p-error">{formik.errors.connection_id}</small>
                                )}
                            </div>

                            <div className="p-field">
                                <label htmlFor="name">Name</label>
                                <InputText
                                    id="name"
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={formik.touched.name && formik.errors.name ? 'p-invalid' : ''}
                                    disabled={isLoading}
                                />
                                {formik.touched.name && formik.errors.name && (
                                    <small className="p-error">{formik.errors.name}</small>
                                )}
                            </div>

                            <div className="p-field">
                                <label htmlFor="ui_url">UI URL</label>
                                <InputText
                                    id="ui_url"
                                    name="ui_url"
                                    value={formik.values.ui_url}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={formik.touched.ui_url && formik.errors.ui_url ? 'p-invalid' : ''}
                                    disabled={isLoading}
                                />
                                {formik.touched.ui_url && formik.errors.ui_url && (
                                    <small className="p-error">{formik.errors.ui_url}</small>
                                )}
                            </div>

                            <div className="p-field">
                                <label htmlFor="api_url">API URL</label>
                                <InputText
                                    id="api_url"
                                    name="api_url"
                                    value={formik.values.api_url}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={formik.touched.api_url && formik.errors.api_url ? 'p-invalid' : ''}
                                    disabled={isLoading}
                                />
                                {formik.touched.api_url && formik.errors.api_url && (
                                    <small className="p-error">{formik.errors.api_url}</small>
                                )}
                            </div>

                            <div className="p-field">
                                <label htmlFor="username">Username</label>
                                <InputText
                                    id="username"
                                    name="username"
                                    value={formik.values.username}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="p-field">
                                <label htmlFor="password">Password</label>
                                <InputText
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="p-field">
                                <label htmlFor="header">Header (JSON)</label>
                                <InputTextarea
                                    id="header"
                                    name="header"
                                    rows={5}
                                    value={JSON.stringify(formik.values.header)}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={formik.touched.header && formik.errors.header ? 'p-invalid' : ''}
                                    disabled={isLoading}
                                />
                                {formik.touched.header && formik.errors.header && (
                                    <small className="p-error">{formik.errors.header}</small>
                                )}
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    gap: CARD_GAP
                                }}
                            >
                                <Button
                                    onClick={() => {
                                        router.push(PATH.main)
                                    }}
                                    icon="pi pi-trash" severity="danger" text  disabled={isLoading}
                                    type="button"
                                />
                                <Button
                                    onClick={() => {
                                        router.push(PATH.main)
                                    }}
                                    label="Cancel" severity="danger" outlined disabled={isLoading}
                                    type="button"
                                />
                                <Button type="submit" label="Save" severity="success" disabled={isLoading} />
                            </div>
                        </div>
                    </Panel>
                </form>

                <Panel
                    header="Connection Detail"
                    style={{
                        width: '50%',
                    }}
                    icons={<>
                        <Button onClick={handleTest} label="Test Connection" icon={testIcon} size='small' disabled={isLoading || !canTest} />
                        {/* <Button type="submit" label="Register" className="p-mt-2" disabled={isLoading} /> */}

                    </>}
                >
                    <>
                        <p>
                            Version :
                            {
                                testConnection?.data?.version?.version
                            }
                        </p>
                        <StatusCard
                            data={testConnection?.data?.status as InstanceStatus}
                        />
                    </>
                </Panel>
            </div>

        </motion.div>
    );
};

export default AirflowConnectionForm;
