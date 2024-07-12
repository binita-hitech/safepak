import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Box,
  IconButton,
  Skeleton,
  TableFooter,
  TablePagination,
  useTheme,
} from "@mui/material";
import moment from "moment/moment";
import {
  Check,
  Clear,
  KeyboardArrowDown,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardArrowUp,
  UnfoldMore,
} from "@mui/icons-material";
import PropTypes from "prop-types";
import OptionMenu from "./OptionMenu";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.light,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  "& svg": {
    position: "relative",
    top: "5px",
  },
  "&:last-child": {
    // paddingRight: 64,
    "& svg": {
      // display: 'none',
      // color: theme.palette.primary.dark
    },
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function TablePaginationActions(props) {
  const { count, page, rowsPerPage, onPageChange } = props;
  const theme = useTheme();

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  return (
    <div style={{ flexShrink: "0" }}>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 1}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage)}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const login = localStorage.getItem("login");
const loginData = JSON.parse(login);

export default function TableComponent(props) {

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              {props.columns.map((col, index) =>
                props.sort ? (
                  ((index === (props.columns.length)) || index == 0 || index === (props.columns.length - 1)) ?
                  <StyledTableCell>

                    {col.name}
                    {/* {props.currentColumn === col.id ? <span style={{ fontWeight:"700" }}>{col.name}</span> : col.name}
                   {props.currentColumn === col.id ? props.direction ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" /> : <UnfoldMore fontSize="small" />}   */}
                  </StyledTableCell>

                  :
                  <StyledTableCell align="" onClick={() => props.handleSort(col.id)}>
                    {props.currentColumn === col.id ? <span style={{ fontWeight: "700" }}>{col.name}</span> : col.name}
                    {props.currentColumn === col.id ? props.direction ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" /> : <UnfoldMore fontSize="small" />}
                  </StyledTableCell>
                
                ) : index === 0 ? (
                  <StyledTableCell>{col.name}</StyledTableCell>
                ) : (
                  <StyledTableCell align="">{col.name}</StyledTableCell>
                )
              )}
            </TableRow>
          </TableHead>
          {props.loading ? (
            <TableBody
              sx={{ position: "relative", height: "465px", overflow: "hidden" }}
            >
              <Box p={3} sx={{ position: "absolute", width: "100%" }}>
                <Skeleton height={60} />
                <Skeleton height={60} />
                <Skeleton height={60} />
                <Skeleton height={60} />
                <Skeleton height={60} />
                <Skeleton height={60} />
                <Skeleton height={60} />
              </Box>
            </TableBody>
          ) : (
            <TableBody>
              {props.rows.length ?
                props.rows
                  // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index1) => (
                    <StyledTableRow
                      key={Math.random()}
                      // onClick={() => props.handleView(row)}
                      style={{ cursor: "pointer" }}
                    >
                      {props.columns.map((col, index) =>
                       (col.id === "sn") ? (
                        <StyledTableCell align="" style={{ zIndex: "1" }}  >

                          {Number(props.fromTable) + index1}

                        </StyledTableCell>
                      )
                        :
                        col.id === "image" ? (
                          index === 0 ? (
                            <StyledTableCell component="th" scope="row">
                              <img
                                src={row.image}
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  objectFit: "cover",
                                }}
                                alt={row.firstname}
                              />
                            </StyledTableCell>
                          ) : (
                            <StyledTableCell align="">
                              <img
                                src={row.image}
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  objectFit: "cover",
                                }}
                                alt={row.firstname}
                              />
                            </StyledTableCell>
                          )
                        ) : index === 0 ? (
                          <StyledTableCell component="th" scope="row">
                            {row[col.id]}
                          </StyledTableCell>
                        ) : col.id === "description" ||
                          col.id === "shortDescription" ||
                          col.id === "text" ? (
                          <StyledTableCell align="left" sx={{ width: "500px" }}>
                            {(
                              row[col.id].substring(0, 100) +
                              (row[col.id].length > 100 ? "..." : " ")
                            ).replaceAll(/<[^>]+>/g, "")}
                          </StyledTableCell>
                        ) : (
                          <StyledTableCell align="">
                            {
                            col.id === "actions" ?
                             
                                <>
                                  <OptionMenu
                                    row={row}
                                    options={props.options}
                                    currentChange={props.currentChange}
                                  />
                                </>
                                :
                            //     loginData.UserLevel === 1 ?
                            //       <>
                            //         <OptionMenu
                            //           row={row}
                            //           options={props.options}
                            //           currentChange={props.currentChange}
                            //         />
                            //       </> : <></>

                             // : 
                              col.id === "company_status" ? (
                                row[col.id] === 1 ? (
                                  <Check color="primary" />
                                ) : (
                                  <Clear color="primary" />
                                )
                              ) :col.id === "is_active" ? (
                                row[col.id] === 1 ? (
                                  <Check color="primary" />
                                ) : (
                                  <Clear color="primary" />
                                )
                              ) :col.id === "is_deleted" ? (
                                row[col.id] === 0 ? (
                                  <Check color="primary" />
                                ) : (
                                  <Clear color="primary" />
                                )
                              ) : col.id === "lastUpdated" ? (
                                moment(row[col.id]).format(
                                  "ddd, MMM Do YYYY, h:mm:ss a"
                                )
                              ): col.id === "added_date" ? (
                                moment(row[col.id]).format(
                                  "ddd, MMM Do YYYY, h:mm:ss a"
                                )
                              ) : col.id === "updated_date" ? (
                                moment(row[col.id]).format(
                                  "ddd, MMM Do YYYY, h:mm:ss a"
                                )
                              )  :
                                col.id === "UserLevel" ? (
                                  row[col.id] === 1 ? "Admin" : "Staff"
                                ) :
                                col.id === "userModules" ? (
                                  Array.isArray(row[col.id]) ? row[col.id].join(', ') : row[col.id]
                                 )
                                :
                                  (
                                    row[col.id] || "-"
                                  )}
                          </StyledTableCell>
                        )
                      )}
                    </StyledTableRow>
                  ))
                :
                <TableRow sx={{ position: "relative", height: "50px" }}>
                  <TableCell sx={{ position: "absolute", right: "50%", borderBottom: "none" }}>
                    No Records Found
                  </TableCell>
                </TableRow>
              }
            </TableBody>
          )}

          {props.footer !== false && (
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[20, 50, 70, 100]}
                  rowsPerPage={props.rowsPerPage}
                  page={props.page}
                  count={props.total && props.total}
                  SelectProps={{
                    native: true,
                  }}
                  labelDisplayedRows={() =>
                    `${props.fromTable !== null ? props.fromTable : "0"} - ${props.toTable !== null ? props.toTable : "0"
                    } to ${props.total}`
                  }
                  onPageChange={props.handleChangePage}
                  onRowsPerPageChange={props.handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </TableContainer>
      {/* {props.footer !== false && (
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={props.rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )} */}
    </Paper>
  );
}
