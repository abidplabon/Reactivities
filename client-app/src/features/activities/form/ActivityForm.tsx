import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Header, Segment } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import { Formik, Form} from 'formik';
import * as yup from 'yup';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyTextArea from '../../../app/common/form/MyTextArea';
import MySelectInput from '../../../app/common/form/MySelectInput';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import MyDateInput from '../../../app/common/form/MyDateInput';
import { ActivityFormValues } from '../../../app/models/activity';
import {v4 as uuid} from 'uuid';


export default observer(function ActivityForm(){
    const history=useHistory();
    const {activityStore}=useStore();
    const{createActivity,updateActivity,
        loadActivity,loadingInitial}=activityStore;
    const {id}=useParams<{id:string}>();

    const[activity,setActivity]=useState<ActivityFormValues>(new ActivityFormValues());

    const validationSchema=yup.object({
        title:yup.string().required('The activity title is required'),
        description:yup.string().required('The activity description is required'),
        category:yup.string().required('The category is required'),
        date:yup.string().required('The activity date is required').nullable(),
        venue:yup.string().required('The activity venue is required'),
        city:yup.string().required('The activity city is required'),
    })

    useEffect(() => {
        if(id) loadActivity(id).then(activity=>setActivity(new ActivityFormValues(activity)))
    },[id,loadActivity]);

    function handleFormSubmit(activity:ActivityFormValues){
        if(!activity.id){
            let newActivity={
                ...activity,
                id:uuid()
            };
            createActivity(newActivity).then(()=>history.push(`/activities/${newActivity.id}`))
        }else{
            updateActivity(activity).then(()=>history.push(`/activities/${activity.id}`))
        }
    }

    if(loadingInitial)return <LoadingComponent content='Loading activity...'/>
    
    return(
        <Segment clearing>
            <Header content='Activity Details' sub color='teal'/>
            <Formik 
                validationSchema={validationSchema}
                enableReinitialize 
                initialValues={activity} 
                onSubmit={values=>handleFormSubmit(values)}>
                {({handleSubmit,isValid,isSubmitting,dirty})=>(
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                       <MyTextInput name='title' placeholder='Title'/>
                    
                    <MyTextArea rows={3} placeholder="Description" name='description' />
                    <MySelectInput options={categoryOptions} placeholder="Category" name='category' />
                    <MyDateInput 
                        placeholderText="Date" 
                        name='date'
                        showTimeSelect
                        timeCaption='time'
                        dateFormat='MMMM d, yyyy h:mm aa' />
                    <Header content='Activity Details' sub color='teal'/>
                    <MyTextInput placeholder="City" name='city' />
                    <MyTextInput placeholder="Venue"  name='venue' />
                    <Button 
                        disabled={isSubmitting||!dirty||!isValid}
                        loading={isSubmitting} 
                        floated='right' 
                        positive type='submit' 
                        content='Submit'/>
                    <Button as={Link} to='/activities' floated='right' content='Cancel'/>
                </Form>
                )}
            </Formik>
        </Segment>
    )
})