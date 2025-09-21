import React, { useState } from 'react'

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

const Organization = ({ organization }) => {

  const [coordinatorExpanded, setcoordinatorExpanded] = useState(false);
  const cordinatorView = () => {
    setcoordinatorExpanded(!coordinatorExpanded);
  };

  const InfoBox = ({ lable, value, icon: Icon }) => {
    return (
      <div className='flex border-b-2 border-white py-2 my-3'>
        <label className="flex text-sm text-gray-900 w-28">
          {Icon && <Icon className='mr-2 mt-1' />}
          {lable}:
        </label>
        <div className="block text-sm font-medium text-gray-900">
          {value}
        </div>
      </div>
    );
  };

  return (
    <label className="inline-flex  items-center justify-between text-gray-900 w-full pt-3 border-t-2 border-t-gray-200 hover:bg-slate-100">
      <div className="block w-full ">
        <div className='flex w-full'>
          <div className="w-3/6 ml-4 pr-2">
            <div className="text-sm font-semibold">
              <span>{organization ? organization.name.slice(0, 55) : 'Not Defined'}</span>
              {organization.SME === "true" && <span className='bg-green-600 text-white ml-3 rounded-full text-sm py-1'>SME</span>}
            </div>
            <div className="mt-1 flex">

              {organization ? (
                <ReactCountryFlag
                  countryCode={getCode(organization.country) || organization.country}
                  svg
                  style={{
                    width: '1.5em',
                    height: '1.5em',
                  }}
                  title={getName(organization.country) || organization.country}
                />
              ) : (
                <p className="text-xs">Coordinator Country: {organization ? getName(organization.country) || organization.country : 'Not Defined'}</p>
              )}
            </div>
          </div>
          <div className="w-1/6 text-sm">
            <Tooltip
              title="Number of the Projects"
              placement="right-start"
              arrow
              slots={{
                transition: Fade,
              }}
              slotProps={{
                transition: { timeout: 600 },
              }}
            >
              <IconButton>
                <span className='ml-1 sm:ml-4 inline-flex items-center justify-center mb-1 w-7 h-7 text-xs font-bold text-blue-500 border-2 border-blue-500 rounded-full'>
                  {organization.project_count}
                </span>
              </IconButton>
            </Tooltip>
          </div>
          <div className="w-1/6 text-xs sm:text-sm">
            <p>Net EU Contribution: <br /> <span className='font-semibold'> {organization.netEcContribution} </span></p>
          </div>
          <div className="w-1/6 text-xs sm:text-sm ml-2">
            <p>Total Contributions: <br /> <span className='font-semibold'> {organization.ecContribution}</span></p>
          </div>
          <div className="ml-2">
            <button onClick={cordinatorView} className="hover:font-bold px-5 inline-flex items-center cursor-pointer">
              <motion.span animate={{ rotate: coordinatorExpanded ? 180 : 0 }}>
                <BsCaretDownFill className="ml-3" />
              </motion.span>
            </button>
          </div>
        </div>

        {/* show details of organization */}
        {coordinatorExpanded && organization && (
          <motion.div className='flex bg-gray-200 p-3 rounded-bl-lg rounded-br-lg mt-5'>
            <div class="lg:flex mt-1 mx-2  w-11/12">
              <div className='lg:w-1/2'>
                <InfoBox lable="Role" icon={RiAdminFill} value={organization.role} />
                <InfoBox lable="Address" icon={MdLocationPin} value={organization.street + ", " + organization.postCode + ", " + organization.city} />
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
        )}
      </div>
    </label>
  )
}

export default Organization
