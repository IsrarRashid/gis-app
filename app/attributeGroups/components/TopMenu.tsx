"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Form from "./Form";
import { attributeGroupsAPI } from "@/app/APIs";
import { getFormattedDate } from "@/app/utils";
import useAttributeGroups from "@/app/hooks/useAttributeGroups";

interface Props {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const TopMenu = ({ refresh, setRefresh }: Props) => {
  const { data } = useAttributeGroups({ refresh });

  return (
    <>
      <div className="row d-flex p-3">
        <div className="col-lg-6 col-md-6 col-sm-12">
          <h4 className="fw-bold">Attribute Groups</h4>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12">
          <div className="row d-flex ">
            <div className="col d-none d-lg-block"></div>
            <div className="col text-end">
              <span className="fw-bold">{getFormattedDate()}</span> Today
            </div>
            <div className="col text-end">
              <Form
                api={attributeGroupsAPI}
                method="POST"
                setRefresh={setRefresh}
                refresh={refresh}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row p-3">
        <div className="col-lg-6 col-md-6 col-sm-12">
          <p>
            Showing:{" "}
            <span className="fw-bold">{data?.length} Attribute Groups</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default TopMenu;
