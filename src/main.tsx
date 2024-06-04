import { useState } from "react";
import "./main.css";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";

interface ISchool {
  name: string;
  address: string;
  amount: number;
}

export function Main() {
  const [schoolData, setSchoolData] = useState<ISchool[]>([]);

  const path = "http://localhost:9000/";

  const onChangeHandler = (event: any) => {
    var reader = new FileReader();
    if (event.target.files != null) {
      reader.readAsArrayBuffer(event.target.files[0]);
      reader.onload = function (e) {
        if (event.target.files) {
          const bstr: any = e?.target?.result;
          var workbook = XLSX.read(bstr, { type: "binary", cellDates: true });
          var first_worksheet = workbook.Sheets[workbook.SheetNames[0]];

          console.log("first_worksheet : ", first_worksheet);

          var data = XLSX.utils.sheet_to_json<any[]>(first_worksheet, {
            header: 1,
            range: 1,
            blankrows: false,
          });

          console.log("data", data);

          if (data.length > 0) {
            setSchoolData(
              data.map(
                (e) =>
                  ({
                    name: e[0],
                    address: e[1],
                    amount: e[2],
                  } as ISchool)
              )
            );
          }

          event.target.value = null;
        }
      };
    }
  };

  const acceptCsvExcel =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel";

  const downloadImportTemplate = async () => {
    FileSaver.saveAs(
      path + "testdata.xlsx",
      "MasterMappingParkingImportTemplate.xlsx"
    );
  };

  return (
    <>
      <label htmlFor="uploadFile">
        <span>
          <input
            // style={{
            //   display: "none",
            // }}
            onChange={onChangeHandler}
            onClick={() => {}}
            accept={acceptCsvExcel}
            id="uploadFile"
            type="file"
          />
        </span>
      </label>
      {schoolData.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {schoolData.map((school, index) => (
              <tr key={index}>
                <td>{school.name}</td>
                <td>{school.address}</td>
                <td>{school.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        ""
      )}

      <hr />
      <button type="submit" onClick={() => downloadImportTemplate()}>
        download file
      </button>
    </>
  );
}
