import { useState } from "react";
import axios from "axios";
import Button1 from "react-bootstrap/Button";
import Card1 from "react-bootstrap/Card";
import famImg from "../../images/famclinic.png";
import hpImg from "../../images/clinicHP.png";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";
import AppBar from "@mui/material/AppBar";
import "../../App.css";
import Button from "@mui/material/Button";
import ResponsiveAppBar from "../../components/TopBar";

const PatientHP = () => {
  //assuming that patient id is in window.location named patientID
  const params = new URLSearchParams(window.location.search);
  let patientID = params.get("patientId");
  /////////////////////REMOVE THAT
  //patientID = "6529c70a6be1d55abc0d0114";
  const [addFamilyMemForm, setaddFamilyMemForm] = useState(false);
  const [linkFamilyMemForm, setlinkFamilyMemForm] = useState(false);
  const [healthPackageshow, sethealthPackageshow] = useState(false);
  const [nonlinkedfamily, setnonlinkedfamily] = useState([]);
  const [linkedfamily, setlinkedfamily] = useState([]);
  const [healthPackages, setHealthPackages] = useState([]);
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [dropdownFam, setdropdownFam] = useState(false);
  const [MyPatient, setMyPatient] = useState({});
  const [discount, setDiscount] = useState(0);
  const [whom, setWhom] = useState(0);
  const [Fammember, setFammember] = useState("");
  const [wallet, setWallet] = useState("");
  const [mydiscount, setmydiscount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [familyMembers, setFamilyMembers] = useState([]);

  //add a new family member
  const [name, setName] = useState("");
  const [nationalID, setNationalID] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [relation, setRelation] = useState("");

  useState(() => {
    axios
      .get(`http://localhost:8000/patient/NotlinkedFamily/${patientID}`)
      .then((res) => {
        setnonlinkedfamily(res.data);
      })
      .catch((error) => {
        res.status(400).send(error);
        console.error("Error fetching data:", error);
      });

    Promise.all([
      axios.get("http://localhost:8000/patient/patientdetails/" + patientID),
      axios.get("http://localhost:8000/patient/healthPackage"),
    ])
      .then(([response1, response2]) => {
        setMyPatient(response1.data);
        setHealthPackages(response2.data);
        const subscribedHP = response1.data.healthPackageSub;
        console.log(response1.data);
        console.log(subscribedHP);
        if (subscribedHP !== "") {
          //get family discount
          setDiscount(
            response2.data.filter((HP) => HP.name === subscribedHP)[0]
              .subDiscount
          );
          // console.log(response2.data.filter(HP => HP.name === subscribedHP)[0].subDiscount);
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });

    axios
      .get(`http://localhost:8000/patient/mydiscount/${patientID}`)
      .then((res) => {
        setmydiscount(res.data);
        console.log("my discount" + res.data);
      })
      .catch((error) => {
        res.status(400).send(error);
        console.error("Error fetching data:", error);
      });
  }, []);
  const subscribeforMe = (packageid) => {
    setSelectedPackageId(packageid);
    setWhom(1);
  };

  const handleFMSubsc = (packageid) => {
    setSelectedPackageId(packageid);
    setWhom(2);
    setdropdownFam(true);
    axios
      .get(`http://localhost:8000/patient/NotlinkedFamily/${patientID}`)
      .then((res) => {
        setnonlinkedfamily(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        res.status(400).send(error);
        console.error("Error fetching data:", error);
      });
  };

  const cancelsubscFam = (memberid) => {
    //console.log(memberid);
    axios
      .post("http://localhost:8000/patient/cancelFMsubscription/" + memberid)
      .then((res) => {
        alert(res.data);
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  };

  const cancelMYsubsc = () => {
    if (MyPatient.subscriptionStatus === "cancelled with end date") {
      alert("already cancelled");
      return;
    }
    axios
      .post("http://localhost:8000/patient/cancelMYsubscription/" + patientID)
      .then((res) => {
        alert(res.data);
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  };

  const handleWalletPayment = async (price, packageName) => {
    //subscription , for me
    if (whom === 1) {
      axios
        .post(`http://localhost:8000/patient/subscribeForMe/${patientID}`, {
          HPname: packageName,
        })
        .then((res) => {
          alert(res.data);
          setSelectedPackageId("");
          setWhom(0);
          //payment
          console.log("i am paying for myself  by wallet");
          try {
            // Make a request to your backend to update the wallet
            const response = axios.put(
              `http://localhost:8000/patient/updateWallet`,
              {
                patientId: patientID,
                paymentAmount: -(price - price * mydiscount),
              }
            );
            // Update the wallet state with the updated value from the response
            console.log("walletUpdated");
            //setWallet(response.data.updatedWallet);
          } catch (error) {
            console.error("Error updating wallet:", error);
          }
        })
        .catch((error) => {
          res.status(400).send(error);
        });
    }

    if (whom === 2 && Fammember != "") {
      axios
        .post(`http://localhost:8000/patient/subscribeForFam/${Fammember}`, {
          HPname: packageName,
        })
        .then((res) => {
          alert(res.data);
          try {
            // Make a request to your backend to update the wallet
            const response = axios.put(
              `http://localhost:8000/patient/updateWallet`,
              {
                patientId: patientID,
                paymentAmount: -(price - price * discount),
              }
            );
            // Update the wallet state with the updated value from the response
            console.log("walletUpdated");
            //setWallet(response.data.updatedWallet);
          } catch (error) {
            console.error("Error updating wallet:", error);
          }
        })
        .catch((error) => {
          res.status(400).send(error);
        });
      setdropdownFam(false);
      setSelectedPackageId("");
      setFammember("");
      setWhom(0);
    }
  };

  const handleCreditCardPayment = (packageName) => {
    axios
      .post("http://localhost:8000/PackageCheckout")
      .then((response) => {})
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    console.log("i am here");
    //subscription
    if (whom === 1) {
      axios
        .post(`http://localhost:8000/patient/subscribeForMe/${patientID}`, {
          HPname: packageName,
        })
        .then((res) => {
          alert(res.data);
          setSelectedPackageId("");
          setWhom(0);
        })
        .catch((error) => {
          res.status(400).send(error);
        });
    }

    if (whom === 2 && Fammember != "") {
      axios
        .post(`http://localhost:8000/patient/subscribeForFam/${Fammember}`, {
          HPname: packageName,
        })
        .then((res) => {
          alert(res.data);
        })
        .catch((error) => {
          res.status(400).send(error);
        });
      setdropdownFam(false);
      setSelectedPackageId("");
      setFammember("");
      setWhom(0);
    }
  };

  const unsubscribeFam = (memberid) => {
    axios
      .post("http://localhost:8000/patient/unsubscribeForMember/" + memberid)
      .then((res) => {
        alert(res.data);
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  };

  const unsubscribeForMe = () => {
    axios
      .post("http://localhost:8000/patient/unsubscribeForMe/" + patientID)
      .then((res) => {
        alert(res.data);
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  };

  return (
    <div style={{ marginRight: "-5%", marginLeft: "-5%" }}>
      <AppBar
        style={{
          height: "100%",
          backgroundColor: "#F0F0F0",
          overflowY: "auto",
        }}
      >
        <ResponsiveAppBar />
        <div
          className="card col-12 mt-3 mb-3"
          style={{ maxWidth: "80%", marginLeft: "10%" }}
        >
          <div>
            <div style={{ "text-align": "left", color: "#000000" }}>
              <h2>Health Packages</h2>
            </div>
            <div
              style={{
                "text-align": "left",
                overflow: "auto",
                color: "#000000",
              }}
            >
              {healthPackages.map((package1) => (
                <div
                  key={package1._id}
                  style={{
                    border: "1px solid black",
                    "text-align": "center",
                    "margin-bottom": "10px",
                    width: 500,
                    borderRadius: 5,
                  }}
                >
                  <p>
                    <strong>Name:</strong> {package1.name}
                  </p>
                  <p>
                    <strong>Price:</strong> {package1.price + " L.E."}
                  </p>
                  <p>
                    <strong>doctor's session price discount:</strong>{" "}
                    {package1.sessDiscount * 100 + "%"}
                  </p>
                  <p>
                    <strong>medicin discount:</strong>{" "}
                    {package1.medDiscount * 100 + "%"}
                  </p>
                  <p>
                    <strong>family subscribtion discount:</strong>{" "}
                    {package1.subDiscount * 100 + "%"}
                  </p>
                  <Button1
                    href="#id"
                    style={{ "margin-right": 15, "margin-bottom": 5 }}
                    onClick={() => {
                      subscribeforMe(package1._id);
                    }}
                  >
                    subscribe for myself
                  </Button1>
                  <Button1
                    style={{ "margin-bottom": 5 }}
                    onClick={() => {
                      handleFMSubsc(package1._id);
                    }}
                  >
                    subscribe for a family member
                  </Button1>
                  <div>
                    <Badge bg="secondary">
                      {mydiscount * 100} % Offer for you{" "}
                    </Badge>{" "}
                    <Badge bg="secondary">
                      {discount * 100} % Offer for any member
                    </Badge>
                  </div>
                  {selectedPackageId === package1._id ? (
                    <div>
                      {" "}
                      <Button1
                        variant="outline-primary"
                        onClick={() => {
                          handleWalletPayment(package1.price, package1.name);
                        }}
                      >
                        Pay using wallet
                      </Button1>{" "}
                      <Button1
                        variant="outline-primary"
                        onClick={() => {
                          handleCreditCardPayment(package1.name);
                        }}
                      >
                        Pay using credit card
                      </Button1>{" "}
                    </div>
                  ) : null}
                  {selectedPackageId === package1._id && dropdownFam ? (
                    <div>
                      <h3 style={{ "margin-up": 10 }}>Choose a member</h3>
                      <ListGroup defaultActiveKey="#link1">
                        {nonlinkedfamily.map((member) => (
                          <ListGroup.Item
                            variant="primary"
                            action
                            key={member.id}
                            onClick={() => {
                              setFammember(member._id);
                            }}
                          >
                            <p>
                              <strong>Name:</strong> {member.name}
                            </p>
                            <p>
                              <strong>Relation:</strong> {member.relation}
                            </p>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <h2 style={{ "text-align": "left", color: "#000000" }}>
              subscriptions
            </h2>

            <Table striped bordered hover>
              <tbody>
                <tr>
                  <td>My Health Package:</td>
                  <td>{MyPatient.healthPackageSub}</td>
                </tr>
                <tr>
                  <td>Due date:</td>
                  <td>{MyPatient.DateOfSubscribtion}</td>
                </tr>
                <tr>
                  <td>subscription status:</td>
                  <td>{MyPatient.subscriptionStatus}</td>
                </tr>

                <tr>
                  <td style={{ justifyContent: "right" }} colSpan={2}>
                    <Button1
                      variant="outline-danger"
                      onClick={() => {
                        cancelMYsubsc();
                      }}
                    >
                      cancel Subscription
                    </Button1>
                    <Button1
                      variant="outline-danger"
                      onClick={() => {
                        unsubscribeForMe();
                      }}
                    >
                      Unsubscribe
                    </Button1>
                  </td>
                </tr>
              </tbody>
            </Table>

            <div style={{ justifyContent: "left", color: "#000000" }}>
              <a>Family Subscriptions </a>{" "}
            </div>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Member's name</th>
                  <th>relation</th>
                  <th>health package subscription</th>
                  <th>due date</th>
                  <th>subscription status</th>
                </tr>
              </thead>
              <tbody>
                {nonlinkedfamily
                  .filter((member) => member.healthPackageSub !== "")
                  .map((member) => (
                    <tr>
                      <td>{member.name}</td>
                      <td>{member.relation}</td>
                      <td>{member.healthPackageSub}</td>
                      <td>{member.DateOfSubscribtion}</td>
                      <td>{member.subscriptionStatus}</td>
                      <td>
                        {" "}
                        <Button1
                          type="button"
                          variant="outline-danger"
                          onClick={() => {
                            cancelsubscFam(member._id);
                          }}
                        >
                          cancel
                        </Button1>{" "}
                        <Button1
                          variant="outline-danger"
                          onClick={() => {
                            unsubscribeFam(member._id);
                          }}
                        >
                          Unsubscribe
                        </Button1>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>
        </div>
      </AppBar>
    </div>
  );
};

//.filter(member => member.healthPackageSub !== '') in line 433
export default PatientHP;
