import React, { useState, useMemo } from 'react'

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';

import { getName, getCode } from 'country-list';
import ReactCountryFlag from "react-country-flag";
import { motion } from 'framer-motion';

import { FaPercent, FaAdn, FaLinkedin, FaPhoneAlt, FaBarcode } from "react-icons/fa";
import { BsCaretDownFill } from "react-icons/bs";
import { MdLocationPin, MdEmail, MdPerson } from "react-icons/md";
import { TbWorldWww } from "react-icons/tb";
import { RiAdminFill } from "react-icons/ri";
import ContactsSpeedDial from './ContactsSpeedDial';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const Organization = ({ organizations, title, icon: Icon }) => {

  const [order, setOrder] = useState("organizationName");

  console.log('order changed to: ', order)

  // Track expanded state for each organization individually
  const [expandedOrgIds, setExpandedOrgIds] = useState(new Set());

  const toggleDetails = (orgId) => {
    setExpandedOrgIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orgId)) {
        newSet.delete(orgId);
      } else {
        newSet.add(orgId);
      }
      return newSet;
    });
  };

  const isOrgExpanded = (orgId) => expandedOrgIds.has(orgId);

  // Sort organizations based on selected order
  const sortedOrganizations = useMemo(() => {
    const sorted = [...organizations].sort((a, b) => {
      switch (order) {
        case "organizationName":
          return (a.name || '').localeCompare(b.name || '');

        case "projectNumber":
          return (b.project_count || 0) - (a.project_count || 0);

        case "coordinatedNumber":
          return (b.coordinator_count || 0) - (a.coordinator_count || 0);

        case "netEU":
          const aNet = parseFloat((a.netEcContribution || '0').toString().replace(/[^0-9.-]/g, '')) || 0;
          const bNet = parseFloat((b.netEcContribution || '0').toString().replace(/[^0-9.-]/g, '')) || 0;
          return bNet - aNet;

        case "total":
          const aTotal = parseFloat((a.ecContribution || '0').toString().replace(/[^0-9.-]/g, '')) || 0;
          const bTotal = parseFloat((b.ecContribution || '0').toString().replace(/[^0-9.-]/g, '')) || 0;
          return bTotal - aTotal;

        default:
          return 0;
      }
    });
    return sorted;
  }, [organizations, order]);

  const InfoBox = ({ lable, value, icon: Icon }) => {
    return (
      <div className='flex border-b-2 border-white py-2 my-3'>
        <label className="flex text-sm text-gray-900 dark:text-gray-300 w-28">
          {Icon && <Icon className='mr-2 mt-1' />}
          {lable}:
        </label>
        <div className="block text-sm font-medium text-gray-900 dark:text-gray-300">
          {value}
        </div>
      </div>
    );
  };

  return (
    <div className="pb-2 mb-3 mt-20">
      <div className="flex text-lg text-gray-700 dark:text-gray-200">
        {Icon && <Icon className='mt-1 mr-3' />}
        <h3>{title}:</h3>
      </div>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 485 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <button
                    onClick={() => setOrder("organizationName")}
                    className={`font-bold cursor-pointer hover:text-blue-500 ${order === "organizationName" ? "text-blue-600" : ""}`}
                  >
                    Organization
                  </button>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => setOrder("projectNumber")}
                    className={`font-bold cursor-pointer hover:text-blue-500 ${order === "projectNumber" ? "text-blue-600" : ""}`}
                  >
                    Projects No
                  </button>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => setOrder("coordinatedNumber")}
                    className={`font-bold cursor-pointer hover:text-blue-500 ${order === "coordinatedNumber" ? "text-blue-600" : ""}`}
                  >
                    Coordinated No
                  </button>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => setOrder("netEU")}
                    className={`font-bold cursor-pointer hover:text-blue-500 ${order === "netEU" ? "text-blue-600" : ""}`}
                  >
                    Net EU Contribution
                  </button>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => setOrder("total")}
                    className={`font-bold cursor-pointer hover:text-blue-500 ${order === "total" ? "text-blue-600" : ""}`}
                  >
                    Total Contributions
                  </button>
                </TableCell>
                <TableCell><button className='font-bold'>Extend</button></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedOrganizations.map((organization, index) => {
                const isExpanded = isOrgExpanded(organization._id || index);

                return (
                  <React.Fragment key={organization._id || index}>
                    <TableRow hover>
                      <TableCell>
                        <div className="text-sm font-semibold">
                          <span>{organization ? organization.name.slice(0, 55) : 'Not Defined'}</span>
                          {organization.SME === "true" && <span className='bg-green-600 text-white ml-3 rounded-full text-sm py-1 px-2'>SME</span>}
                        </div>
                        <div className="mt-1 flex">
                          {organization ? (
                            <ReactCountryFlag
                              countryCode={getCode(organization.country) || organization.country}
                              svg
                              style={{ width: '1.5em', height: '1.5em', }}
                              title={getName(organization.country) || organization.country}
                            />
                          ) : (
                            <p className="text-xs">Coordinator Country: {organization ? getName(organization.country) || organization.country : 'Not Defined'}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell align="center">
                        {organization.project_count}
                      </TableCell>
                      <TableCell align="center">
                        {organization.coordinator_count}
                      </TableCell>
                      <TableCell align="center">
                        {organization.netEcContribution}
                      </TableCell>
                      <TableCell align="center">
                        {organization.ecContribution}
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => toggleDetails(organization._id || index)}
                          className="hover:font-bold px-5 inline-flex items-center cursor-pointer"
                        >
                          <motion.span animate={{ rotate: isExpanded ? 180 : 0 }}>
                            <BsCaretDownFill className="ml-3" />
                          </motion.span>
                        </button>
                      </TableCell>
                    </TableRow>

                    {/* show details of organization - spans all columns */}
                    {isExpanded && organization && (
                      <TableRow>
                        <TableCell colSpan={5} style={{ padding: 0, borderBottom: 'none' }}>
                          <motion.div
                            className='flex w-full bg-gray-200 dark:bg-gray-950 p-3'
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="lg:flex mt-1 mx-2 w-11/12">
                              <div className='lg:w-1/2'>
                                <InfoBox lable="Role" icon={RiAdminFill} value={organization.role} />
                                <InfoBox lable="Address" icon={MdLocationPin} value={organization.street.slice(0, 25) + ", " + organization.postCode + ", " + organization.city} />
                                <InfoBox lable="Website" icon={TbWorldWww} value={organization.organizationURL} />
                                <InfoBox lable="Short Name" icon={FaAdn} value={organization.shortName} />
                                <InfoBox lable="LinkedIn" icon={FaLinkedin} />
                              </div>
                              <div className='lg:w-1/2'>
                                <InfoBox lable="NUTS Code" icon={FaBarcode} value={organization.nutsCode} />
                                <InfoBox lable="Vat Number" icon={FaPercent} value={organization.vatNumber} />
                                <InfoBox lable="Answerable" icon={MdPerson} />
                                <InfoBox lable="Phone" icon={FaPhoneAlt} />
                                <InfoBox lable="Email" icon={MdEmail} />
                              </div>
                            </div>
                            <ContactsSpeedDial className="w-1/12" />
                          </motion.div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div >
  );
}

export default Organization;