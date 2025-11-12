import React from "react";
import Header from "../Header";

import CampingActivitySection from "./CampingActivitySection";
import MirissaBookingSection from "../Mirissa/MirissaBookingSection";
import CampingBookingSection from "./CampingBookingSection";
import CampingSites from "./CampingSites";

const Camping = () => {
    return(
<>
<CampingBookingSection/>
<CampingSites/>
<CampingActivitySection/>
</>

    );
};export default Camping;