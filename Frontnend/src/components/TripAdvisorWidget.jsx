import React, { useEffect } from "react";

const TripAdvisorWidget = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.jscache.com/wejs?wtype=cdsratingsonlynarrow&uniq=826&locationId=16701196&lang=en_US&border=true&display_version=2";
    script.async = true;
    script.onload = () => {
      script.loadtrk = true;
    };

    document.getElementById("ta-widget-container")?.appendChild(script);
  }, []);

  return (
    <div id="ta-widget-container">
      <div id="TA_cdsratingsonlynarrow826" className="TA_cdsratingsonlynarrow">
        <ul id="4IifOnz" className="TA_links DUURswSzw">
          <li id="gvTT5JVVRMWa" className="dDRM8AD">
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.tripadvisor.com/Attraction_Review-g3348959-d16701196-Reviews-Kumana_Wild_Trails-Arugam_Bay_Eastern_Province.html"
            >
              <img
                src="https://www.tripadvisor.com/img/cdsi/img2/branding/v2/Tripadvisor_lockup_horizontal_secondary_registered-18034-2.svg"
                alt="TripAdvisor"
              />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TripAdvisorWidget;
