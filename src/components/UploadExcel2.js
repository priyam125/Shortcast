import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux'
import { OutTable, ExcelRenderer } from "react-excel-renderer";
import Select from 'react-select';
import { UPLOAD_EXCEL } from "../Utils/apiroutes";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const UploadExcel2 = () => {
    const [files, setFiles] = useState({});
    const [loaded, setLoaded] = useState(false);
    const [loadExcel, setLoadExcel] = useState(false);
    const [excelLoaded, setExcelLoaded] = useState(false);
    const [isFormInvalid, setIsFormInvalid] = useState();
    const [cols, setCols] = useState();
    const [rows, setRows] = useState();

    const token = useSelector(state => state.account.token)




  
  
    const options = [
      { value: 'create-bulk-post', label: 'create bulk post' },
      { value: 'create-bulk-user', label: 'create bulk user' },
      { value: 'create-genre', label: 'create genre' },
    ];
    const [selectedOptions, setSelectedOptions] = useState(options[0])
    const [selectedDropdown, setselectedDropdown] = useState(false)
  
    const handleDropdown = (selectedOption) => {
        console.log(selectedOption);
      setSelectedOptions({selectedOption})
      setselectedDropdown(true)
  
    }
  
  
    useEffect(() => {
        console.log(selectedOptions);
    },[]);
  
    const handleChange = (e) => {
      console.log(e.target);
      console.log(e.target.files);
  
      if (e.target.files.length) {
        let fileObj = e.target.files[0];
        console.log(fileObj);
  
        let fileName = fileObj.name;
  
        let reader = new FileReader();
  
        if (fileName.slice(fileName.lastIndexOf(".") + 1) === "xlsx") {
          console.log(fileObj);
          let fileURL = reader.readAsDataURL(fileObj);
          console.log(fileURL);
          setFiles(fileObj);
          setIsFormInvalid(false);
          reader.onload = (e) => {
            setLoaded(true);
            console.log("loaded");
  
            // ExcelRenderer(fileObj, (err, resp) => {
            //     if(err){
            //       console.log(err);
            //     }
            //     else{
            //       setCols(resp.cols)
            //       setRows(resp.rows)
            //       setExcelLoaded(true)
            //     }
            //   });
          };
        } else {
          setIsFormInvalid(true);
        }
  
        // console.warn('data file', files)
      }
    };
  
    const renderExcel = (e) => {
      e.preventDefault();
      ExcelRenderer(files, (err, resp) => {
        if (err) {
          console.log(err);
        } else {
          setCols(resp.cols);
          setRows(resp.rows);
          setExcelLoaded(true);
        }
      });
    };
  
    const handleClick = (e) => {
      e.target.value = null;
      setLoaded(false);
      setExcelLoaded(false);
    };
  
    const handleSubmit = (e) => {
      // setExcelLoaded(true)
      e.preventDefault();

      console.log(files.type);

      const formData = new FormData();
      formData.append("file", files);
      formData.append("action", selectedOptions.selectedOption.value);

      

      // let data = {
      //     file: files,
      //     action: selectedOptions.selectedOption.value
      // }

      console.log(formData);

      axios.post(UPLOAD_EXCEL, formData, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${token}`,
          }
      })
        .then((res) => {
            console.log(res);
            if (res.data.status == 1)
            toast.success(`Excel File Uploaded`)
            else if (res.data.status == 0)
            toast.error('Internal Server Error')
        })
        .catch((err) => console.log(err.response.data))   
    };
  
    return (
      <div className="p-20">
      <ToastContainer autoClose={2400} />


        <form className="flex justify-center items-center">
          <div className="flex flex-col items-center justify-center space-y-2">
          <div className='font-bold text-gray-700 pb-2'>Admin Dashboard</div>

            <div className="flex flex-col">
              <input
                className="bg-white w-auto border-2 border-gray-200 space-x-2"
                type="file"
                id="upload"
                onChange={handleChange}
                onClick={handleClick}
              />
              {isFormInvalid && (
                <small className="text-red-600">Please select .xlsx file</small>
              )}
            </div>
  
            <Select className='w-60' value={selectedOptions.value} defaultValue={selectedOptions[0]} onChange={handleDropdown} options={options}/> 
  
            {/*<OutTable data={rows} columns={cols} tableClassName="ExcelTable2007" tableHeaderRowClass="heading" />*/}
  
            <div className="flex items-center justify-center space-x-2">
              {loaded && selectedDropdown && (
                <div className="navbar rounded-md">
                  <button className="py-1 px-3" onClick={handleSubmit}>
                    Submit
                  </button>
                </div>
              )}
  
              {loaded && selectedDropdown && (
                <div className="navbar rounded-md">
                  <button className="py-1 px-3" onClick={renderExcel}>
                    Preview
                  </button>
                </div>
              )}
            </div>
  
            {excelLoaded && (
              <div className = 'p-4'>
                <OutTable
                  data={rows}
                  columns={cols}
                  tableClassName="ExcelTable2007"
                  tableHeaderRowClass="heading"
                />
              </div>
            )}
  
          </div>
        </form>
      </div>
    );
};

export default UploadExcel2;







