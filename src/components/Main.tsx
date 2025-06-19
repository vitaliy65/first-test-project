"use client";

import React from "react";
import TabsContainer from "./TabsContainer";

export default function Main() {
  return (
    <main className="main-container">
      <div className="left-margin"></div>
      <div className="flex flex-col w-full min-h-screen">
        <div className="upper-margin"></div>
        <TabsContainer />
      </div>
    </main>
  );
}
