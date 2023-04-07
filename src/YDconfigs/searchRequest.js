import {useEffect, useState} from 'react';


export const searchRequest = (searchReq) => {
  const [searchData, setSearchData] = useState([]);
   const [isloading, setIsloading] = useState(false);
  const getList = async () => {
    setIsloading(true);
    try {
      const response = await fetch(`https://zmanager-serv.herokuapp.com/search/${searchReq}`);
      const json = await response.json();
      setSearchData(json)
    } catch (error) {
      console.log();
    }finally{
      setIsloading(false);
    } 
  };

  return {searchData,isloading ,getList,setIsloading}
};
