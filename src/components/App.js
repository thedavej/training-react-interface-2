import React, { Component } from "react";
import "../css/App.css";
import AddAppointments from "./AddAppointments";
import SearchAppointments from "./SearchAppointments";
import ListAppointments from "./ListAppointments";
import { without } from "lodash";

class App extends Component {
  constructor() {
    super();
    this.state = {
      appointments: [],
      lastIndex: 0,
      formDisplay: false,
      orderBy: "petName",
      orderDir: "asc",
      queryText: ""
    };
    this.deleteAppointment = this.deleteAppointment.bind(this);
    this.toggleFormDisplay = this.toggleFormDisplay.bind(this);
    this.addAppointment = this.addAppointment.bind(this);
    this.changeSortOrder = this.changeSortOrder.bind(this);
    this.searchAppointments = this.searchAppointments.bind(this);
  }

  deleteAppointment(appointment) {
    this.setState({
      appointments: without(this.state.appointments, appointment)
    });
  }

  toggleFormDisplay() {
    this.setState({ formDisplay: !this.state.formDisplay });
  }

  addAppointment(data) {
    let appointments = this.state.appointments;
    data.id = this.state.lastIndex;
    appointments.push(data);

    this.setState({
      appointment: appointments,
      lastIndex: this.state.lastIndex + 1
    });
    this.toggleFormDisplay();
  }

  changeSortOrder(order, direction) {
    this.setState({
      orderBy: order,
      orderDir: direction
    });
  }

  searchAppointments(query) {
    this.setState({ queryText: query });
  }

  componentDidMount() {
    fetch("./data.json")
      .then(response => response.json())
      .then(result => {
        const data = result.map(item => {
          item.id = this.state.lastIndex;
          this.setState({ lastIndex: this.state.lastIndex + 1 });
          return item;
        });
        this.setState({
          appointments: data
        });
      });
  }

  render() {
    let filteredAppointments = this.state.appointments;
    let order = this.state.orderDir === "asc" ? 1 : -1;

    filteredAppointments = filteredAppointments
      .sort((a, b) => {
        return a[this.state.orderBy].toLowerCase() <
          b[this.state.orderBy].toLowerCase()
          ? -1 * order
          : 1 * order;
      })
      .filter(eachItem => {
        return (
          eachItem["petName"]
            .toLowerCase()
            .includes(this.state.queryText.toLowerCase()) ||
          eachItem["ownerName"]
            .toLowerCase()
            .includes(this.state.queryText.toLowerCase()) ||
          eachItem["aptNotes"]
            .toLowerCase()
            .includes(this.state.queryText.toLowerCase())
        );
      });

    return (
      <main className="page bg-white" id="petratings">
        <div className="container">
          <div className="row">
            <div className="col-md-12 bg-white">
              <div className="container">
                <AddAppointments
                  toggleFormDisplay={this.toggleFormDisplay}
                  formDisplay={this.state.formDisplay}
                  addAppointment={this.addAppointment}
                />
                <SearchAppointments
                  orderBy={this.state.orderBy}
                  orderDir={this.state.orderDir}
                  changeOrder={this.changeSortOrder}
                  queryText={this.state.queryText}
                  search={this.searchAppointments}
                />
                <ListAppointments
                  appointments={filteredAppointments}
                  deleteAppointment={this.deleteAppointment}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default App;
