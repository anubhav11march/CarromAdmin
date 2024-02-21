import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import { getCurrentDate, getISODate } from "../../util";
import { GetWithdrawal, ManageWithdrawal } from "../../api";
import { Button } from "react-bootstrap";

const Transaction = () => {
  const [date, setDate] = React.useState(getCurrentDate("-"));
  const [check, setCheck] = React.useState(false);
  const [check2, setCheck2] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [set, SetSet] = React.useState(0);
  const [limit, setLimit] = React.useState(10);
  const [received, setReceived] = React.useState(false);
  const [data, setData] = React.useState({ totalPages: 0, details: [] });
  const [searchValue, setSearchValue] = React.useState('');


  React.useEffect(() => {
    const fetchData = async () => {
      let responseData;
      if (check) {
        const data = await GetWithdrawal(getISODate(date), page, limit);
        if (data.success && data.message === "Fetched Successfuly!") {
          responseData = data.data
          
        }
      } 
      else if(searchValue)
      {
        let temp
        const data = await GetWithdrawal(null, null, null);
        if (data.success && data.message === "Fetched Successfuly!") {
          temp = data.data
          console.log(temp)
          
        }
        let temp2 = temp?.details.filter(item =>
          item.number.includes(searchValue)
        );
        
       responseData = {totalPages: temp.totalPages,
        details: temp2
      }
      console.log(responseData)
      console.log(temp2)
       }
      else {
        const data = await GetWithdrawal(null, page, limit);
        if (data.success && data.message === "Fetched Successfuly!") {
          responseData = data.data
          
        }
      }
    
      if (responseData && responseData.details && Array.isArray(responseData.details)) {
        // Sort the 'details' array in descending order based on 'createdAt'
        responseData.details.sort((a, b) => 
        {
          const dateA = new Date(a.createdAt);
  const dateB = new Date(b.createdAt);

  return dateB.getTime() - dateA.getTime();
        });
    
        console.log(responseData)
        setData(responseData);
        setReceived(true);
      }
    };
    fetchData();
    return () => {
      setData({ totalPages: 0, details: [] });
      setReceived(false);
    };
  }, [date, page, limit, check,check2,searchValue]);

  const handleChange = (e) => {
    setDate(e.target.value);
  };
  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    setCheck2(true)
  };

  const handleCheck = (e) => {
    setCheck(e.target.checked);
  };

  const handleLimit = (e) => {
    setLimit(e.target.value);
    setPage(1);
  };

  const handleNext = () => {
    page === data.totalPages ? setPage(page) : setPage(page + 1);
    if (page % 5 === 0) SetSet((old) => old + 1);
  };

  const handlePrev = () => {
    page > 1 ? setPage(page - 1) : setPage(page);
    if (page % 5 === 1) SetSet((old) => (old === 0 ? 0 : old - 1));
  };

  const handleApproval = async (id) => {
    const res = await ManageWithdrawal(id, "Accepted");
    if (res.success && res.message === "Updated Successfuly!") {
      setData((old) => {
        return {
          ...old,
          details: old.details.filter((item) => item._id !== id),
        };
      });
    }
  };

  const handleRejection = async (id) => {
    const res = await ManageWithdrawal(id, "Rejected");
    if (res.success && res.message === "Updated Successfuly!") {
      setData((old) => {
        return {
          ...old,
          details: old.details.filter((item) => item._id !== id),
        };
      });
    }
  };

  return (
    <div className="container-fluid">
      <div className="mt-5 pt-5"></div>
      <div className="row">
        <div
          className="col-6 ps-4"
          style={{ fontSize: "22px", fontWeight: "600", color: "#FF9933" }}
        >
          Withdrawal Management
        </div>
        <div className="col-6 d-flex flex-column justify-content-between align-items-end">
          <div
            className="d-flex justify-content-start py-2 pe-2 ps-4 "
            style={{
              border: "1px solid #FF9933",
              borderRadius: "5px",
              width: "500px",
            }}
          >
            <AiOutlineSearch size={25} style={{ color: "#FF9933" }} />
            <input
              className="ps-3 input-no-border"
              style={{ border: "none", color: "#FF9933" }}
              placeholder="Search on Users"
              value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
            />
            
          </div>
          <div
            className="d-flex align-items-center"
            style={{ marginTop: "40px" }}
          >
            <div className="form-check me-5">
              <input
                className="form-check-input"
                type="checkbox"
                checked={check}
                id="datecheck"
                onChange={handleCheck}
              />
              <label className="form-check-label" htmlFor="datecheck">
                At date
              </label>
            </div>
            <input
              type="date"
              style={{
                border: "none",
                fontSize: "20px",
                width: "160px",
                fontWeight: "500",
              }}
              value={date}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div
        className="row m-3 p-3 mt-5"
        style={{ border: "0.5px solid #28318C", borderRadius: "20px" }}
      >
        {received > 0 ? (
          <>
            {data?.details.length > 0 ? (
              <table className="table table-borderless ">
                <thead style={{ borderBottom: "0.5px solid #28318C" }}>
                  <tr>
                    <th scope="col">S.No</th>
                    <th scope="col">User Name</th>
                    <th scope="col">Phone Number</th>
                    <th scope="col">Date</th>
                    <th scope="col">Wallet</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Payemnt</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.details.map((item, id) => (
                    <tr key={item._id}>
                      <th>{id + 1}</th>
                      <td>{item?.name ? item?.name : "-"}</td>
                      <td>{item?.number ? item?.number : "-"}</td>
                      <td>
                        {item.createdAt
                          .substring(0, 10)
                          .split("-")
                          .reverse()
                          .join("-")}
                      </td>
                      <td>${item?.wallet ? item?.wallet : 0}</td>
                      <td>${item?.amount}</td>
                      <td>{item?.method}</td>
                      <td style={{ fontWeight: "500" }}>
                        <span
                          style={{ color: "#28318C", cursor: "pointer" }}
                          onClick={() => handleRejection(item._id)}
                        >
                          Reject{" "}
                        </span>{" "}
                        |{" "}
                        <span
                          style={{ color: "#06CB03", cursor: "pointer" }}
                          onClick={() => handleApproval(item._id)}
                        >
                          {" "}
                          Approve
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="container-fluid my-5 h3 py-5 mx-auto text-center">
                No data
              </div>
            )}
          </>
        ) : (
          <div style={{ margin: " 6em 0" }}>
            <div className="loading-main">
              <div className="loader"></div>
            </div>
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid black",
            marginTop: "5px",
          }}
        >
          <p className="mb-0 mt-2">
            {`Showing Page ${page} out of ${data.totalPages}`}
            {" | "}Enteries in 1 page{" "}
            <input
              type="number"
              style={{ width: "50px" }}
              value={limit}
              onChange={handleLimit}
            />
          </p>{" "}
          <p className="mb-0 mt-2">
            <MdOutlineNavigateBefore
              size={21}
              title="previous page"
              cursor="pointer"
              onClick={handlePrev}
            />
            {set >= 1 ? "..." : ""}
            {[...Array(data.totalPages)].map((n, i) => {
              if (!(i + 1 <= 5 * (set + 1))) return "";
              if (!(i + 1 >= set * 5 + 1)) return "";
              return (
                <span
                  style={{
                    color: parseInt(page) === i + 1 ? "#f20e29" : "",
                    cursor: "pointer",
                  }}
                  onClick={(e) => setPage(i + 1)}
                  key={i}
                >
                  &nbsp; {i + 1}{" "}
                </span>
              );
            })}
            &nbsp;
            {data.totalPages - set * 5 >= 6 ? "..." : ""}
            <MdOutlineNavigateNext
              title="next page"
              cursor="pointer"
              size={21}
              onClick={handleNext}
            />
          </p>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
