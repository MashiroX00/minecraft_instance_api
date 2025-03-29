const Path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const exec = promisify(require("child_process").exec);
const { spawn } = require("child_process");
const { execSync } = require("child_process");
const { spawnSync } = require("child_process");
const { execFile } = require("child_process");
const { Rcon } = require("rcon-client");
class InstanceManager {
  constructor(name, version, path) {
    this.name = name;
    this.version = version;
    this.path = path;
  }
  
  async create(callback) {
    console.log(
      `Creating instance with name: ${this.name} and version: ${this.version} at path: ${this.path}`
    );
    const InstanceName = this.name + this.version;
    const { name, version, path } = this;
    var InstancesPath;
   try{
    InstancesPath = Path.join(__dirname, "../../Intances", InstanceName);
    console.log(`Intance path: ${InstancesPath}`);
   }catch (error) {
    console.error("Error creating instance:", error);
    return;
   }
    //check instance folders exist
    try {
      let isExist = fs.existsSync(InstancesPath);
      if (isExist) {
        console.log(`Intance ${name}` + version + " already exists");
        callback("Intance already exists");
        return;
      } else {
        //create instance folder
        fs.mkdirSync(InstancesPath, { recursive: true });
        console.log(`Intance ${name}` + version + " created");
        callback("Intance created");
      }
    } catch (error) {
      console.error("Error creating instance:", error);
      callback("Error creating instance");
    }
  }
  //delete instance
  async delete(callback) {
    console.log(
        `Deleting instance with name: ${this.name} and version: ${this.version} at path: ${this.path}`
      );
    const { name, version, path } = this;
    const InstanceName = name + version;
    var InstancesPath;
    try{
        InstancesPath = Path.join(__dirname, "../../Intances",InstanceName);
        console.log(`Intance path: ${InstancesPath}`);
    }catch (error) {
        console.error("Error deleting instance:", error);
        return;
    }
    //check instance folders exist
    try {
      let isExist = fs.existsSync(InstancesPath);
      if (!isExist) {
        console.log(`Intance ${name}` + version + " not exists");
        callback("Intance not exists");
        return;
      } else {
        //delete instance folder
        fs.rmdirSync(InstancesPath, { recursive: true });
        console.log(`Intance ${name}` + version + " deleted");
        callback("Intance deleted");
      }
    } catch (error) {
      console.error("Error deleting instance:", error);
      callback("Error deleting instance");
    }
  }
  //start instance
  async start(ram, logCallback) {
    //fine jar file
    const { name, version, path } = this;
    const InstanceName = name + version;
    const InstancesPath = Path.join(__dirname, "../../Intances", InstanceName);
    const jarPath = Path.join(InstancesPath, "server.jar");
    const StoragePath = Path.join(__dirname, "../Storages");
    //check if server is running
    const isRunning = spawnSync("pgrep", ["-f", jarPath]);
    if (isRunning.stdout.length > 0) {
      console.log(`Intance ${name}` + version + " is running");
      return;
    }
    //check instance folders exist
    let isExist = fs.existsSync(InstancesPath);
    let isServerjarexist = fs.existsSync(jarPath);
    try {
      if (!isExist || !isServerjarexist) {
        console.log(
          `Intance ${name}` + version + " not exists or server.jar not found"
        );
        return;
      } else {
        this.ram = ram || 1024;
        //check if ram is valid
        if (ram < 1024 || ram > 8192) {
          console.log("Invalid ram size");
          return;
        }
        const Xmx = `-Xmx${this.ram}M`;
        //start instance using spawn
        const command = "java";
        const args = [Xmx, "-Xms1024M", "-jar", jarPath, "nogui"];
        const options = {
          cwd: InstancesPath,
          stdio: ['pipe', 'pipe', 'pipe'],
        };
        const child = spawn(command, args, options);

        // Send log output to the callback
        if (logCallback && typeof logCallback === "function") {
          child.stdout.on("data", (data) => {
            logCallback(data.toString());
          });
          child.stderr.on("data", (data) => {
            logCallback(data.toString());
          });
        }
        child.on("error", (error) => {
          console.error(`Error starting instance: ${error}`);
          return;
        });
        child.on("exit", (code) => {
          console.log(`Instance exited with code ${code}`);
        });
        console.log(`Intance ${name}` + version + " started");

        //return instance id
        const instanceId = child.pid;
        console.log(`Instance ID: ${instanceId}`);
        //crteate json file to contain instance id
        let isStoragePathexist = fs.existsSync(StoragePath);
        if (!isStoragePathexist) {
          fs.mkdirSync(StoragePath, { recursive: true });
          console.log(`Storage path created`);
        } else {
          let IntanceIDPath = Path.join(InstancesPath);
          //check if json file exist
          /*{
    "Instance": {
        "IHM":{
            "Name": "IHM",
            "version": "1.0.0",
            "pid": "1234"
        },
        "IHM2":{
            "Name": "IHM2",
            "version": "1.0.0",
            "pid": "1234"
        },
        "IHM1":{
            "Name": "IHM3",
            "version": "1.0.0",
            "pid": "1234"
        }
    }
}*/
          let isJsonFileExist = fs.existsSync(IntanceIDPath, "instance.json");
          var pathinstancefile;
          if (!isJsonFileExist) {
            fs.writeFileSync(IntanceIDPath, JSON.stringify({}), "utf8");
            console.log(`Intance ID file created`);
            pathinstancefile = Path.join(StoragePath, "instance.json");
          } else {
            pathinstancefile = Path.join(StoragePath, "instance.json");
          }
          //read json file
          let jsonData = fs.readFileSync(pathinstancefile, "utf8");
          let json = JSON.parse(jsonData);
          //replace instance id if not exist create new instance id
            if (json[InstanceName]) {
                json[InstanceName].pid = instanceId;
            } else {
                json[InstanceName] = {
                Name: name,
                version: version,
                pid: instanceId,
                };
            }
          //write json file
          fs.writeFileSync(pathinstancefile, JSON.stringify(json,null,4), "utf8");
          console.log(`Intance ID file updated`);
          return instanceId;
        }
      }
    } catch (error) {
      console.error("Error starting instance:", error);
    }
  }
  //stop instance sent minecraft stop command to server
  async stop(callback) {
    const { name, version, path } = this;
    const InstanceName = name + version;
    const InstancesPath = Path.join(__dirname, "../../Intances",InstanceName);
    const jarPath = Path.join(InstancesPath, "server.jar");
    let returnmessage;
    //check Instance is running?
    const isRunning = spawnSync("pgrep", ["-f", jarPath]);
    if (isRunning.stdout.length > 0) {
      console.log(`Intance ${name}` + version + " is running");
    } else {
      console.log(`Intance ${name}` + version + " is not running");
        returnmessage = "Intance not running";
      return returnmessage;
    }
    //check instance folders exist
    try {
      let isExist = fs.existsSync(InstancesPath);
      let isServerjarexist = fs.existsSync(jarPath);
      if (!isExist || !isServerjarexist) {
        console.log(
          `Intance ${name}` + version + " not exists or server.jar not found"
        );
        returnmessage = "Intance not exists or server.jar not found";
        
        return returnmessage;
      } else {
        //stop instance using spawn
        const command = "pkill";
        const args = ["-f", jarPath];
        const options = {
          cwd: InstancesPath,
          stdio: ['pipe', 'pipe', 'pipe'],
        };
        const child = spawn(command, args, options);
        child.stdout.on("data", (data) => {
          console.log(`stdout: ${data}`);
          callback(null, data);
        });
        child.stderr.on("data", (data) => {
          console.error(`stderr: ${data}`);
          callback(data);
        });
        child.on("error", (error) => {
          console.error(`Error stopping instance: ${error}`);
          callback(error);
        });
        child.on("exit", (code) => {
          console.log(`Instance exited with code ${code}`);
          callback(null, code);
        });
        console.log(`Intance ${name}` + version + " stopped");
      }
    } catch (error) {
      console.error("Error stopping instance:", error);
    }
  }
  //send command with rcon client
  async sencommand(command,callback,port,password) {
    const Rconport = port;
    const Rconpassword = password;
    const rcon = await Rcon.connect({
        host: "localhost", port: Rconport, password: Rconpassword,
    });
    console.log(`Command Retrieved: ${command}`);
    try {
       let Respones = await rcon.send(command);
       callback(Respones);
       console.log(`Command Sent: ${command}`);
       console.log(`Response: ${Respones}`);
    }catch (error) {
        console.error("Error sending command:", error);
        callback(error);
  }
    rcon.end();
  }
  //get instance 

  async getintance() {
    let StoragePath = Path.join(__dirname, '../Storages');
    let InstanceJSON = Path.join(StoragePath, 'instance.json');
    let Respones = {};
    //Check file exist
    console.log('Checking Instance Config file at:',InstanceJSON);
    let isExist = fs.existsSync(InstanceJSON);
    if (!isExist) {
      console.log('Instance config file is not exist.');
      Respones = {"message": "Instance is empty","isEmpty": true}
      return Respones;
    }else {
      console.log('Intance config file found.');
      let JSONFile = await fs.readFileSync(InstanceJSON, 'utf-8');
      console.log('Reading Jsonfile');
      let data = await JSON.parse(JSONFile);
      console.log('Json file parsed');
      console.log(data);
      return data;
    }
  }
  async checkstatus() {
    const InstanceName = this.name + this.version;
    const InstancePath = Path.join(__dirname, '../../Intances',InstanceName);
    const jarPath = Path.join(InstancePath, 'server.jar')
    const isRunning = spawnSync("pgrep", ["-f", jarPath]);
    let Respones = {}
    if (isRunning.stdout.length > 0) {
      return Respones = {"message": "Server is running", "isRunning": true}
    }else {
      return Respones = {"message": "Server is not running", "isRunning": false}
    }
  }
}

module.exports = InstanceManager;
