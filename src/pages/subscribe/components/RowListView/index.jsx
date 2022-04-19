import React from 'react'
import Empty from '../Empty';


const RowListView = ({
  items,
  isEmpty,
  isLoading,

}) => {
  return (
    <>
      {
        isEmpty && <Empty />
      }
      <ul>
        
      </ul>
    </>

  );
}

export default RowListView;
