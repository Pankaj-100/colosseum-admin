import React from 'react';
import { Empty } from 'antd';
const EmptyItems = ({description}) => <div className='flex justify-center items-center'><Empty   description={description}/></div>;
export default EmptyItems;