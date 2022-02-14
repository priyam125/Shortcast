import React, { useEffect, useState } from "react";
import { OutTable, ExcelRenderer } from "react-excel-renderer";
import Select from 'react-select';


const UploadExcel = () => {
  const [files, setFiles] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [loadExcel, setLoadExcel] = useState(false);
  const [excelLoaded, setExcelLoaded] = useState(false);
  const [isFormInvalid, setIsFormInvalid] = useState();
  const [cols, setCols] = useState();
  const [rows, setRows] = useState();


  const options = [
    { value: '1', label: 'create bulk post' },
    { value: '2', label: 'create user post' },
    { value: '3', label: 'create new user' },
  ];
  const [selectedOptions, setSelectedOptions] = useState(options[0])
  const [selectedDropdown, setselectedDropdown] = useState(false)

  const handleDropdown = (selectedOptions) => {
    setSelectedOptions({selectedOptions})
    setselectedDropdown(true)

  }


  useEffect(() => {});

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
  };

  return (
    <div className="p-20">
      <form className="flex justify-center items-center">
        <div className="flex flex-col items-center justify-center space-y-2">
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

          <Select className='w-60' value={selectedOptions.label} onChange={handleDropdown} options={options}/> 

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

export default UploadExcel;
