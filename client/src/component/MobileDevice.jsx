import React from "react";
import "./Popups.scss";

class MobileDevice extends React.Component {
    render() {
        return (
            <div className="popup" id="popup">
                <div className="popup__notif py-6 px-6 pixelated">
                    <h1 className="title pixel">Sorry!</h1>

                    <h5 className="subtitle is-5 mt-2">
                        This one's a desktop game. Go ahead! Try it on your PC.
                    </h5>
                </div>
            </div>
        );
    }
}

export default MobileDevice;
