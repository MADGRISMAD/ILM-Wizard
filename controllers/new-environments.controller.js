const fs = require('fs');
const path = require('path');

function cargarEnvironments() {
    const rawData = fs.readFileSync(path.join(__dirname, 'jsons/_global_environments.json'));
    return JSON.parse(rawData).environments;
}

function guardarEnvironmentsData(environments) {
    fs.writeFileSync(path.join(__dirname, 'jsons/_global_environments.json'), JSON.stringify({ environments }));
}

function obtenerEnvironments(req, res) {
    const environments = cargarEnvironments();
    res.status(200).json({ code: "OK", object: environments, message: "" });
}

function guardarEnvironments(req, res) {
    const environments = cargarEnvironments();
    environments.push(req.body);
    guardarEnvironmentsData(environments);
    res.status(200).json({ code: "OK", object: environments, message: "Entorno agregado con éxito." });
}

function fetchEnvironmentById(req, res) {
    const environments = cargarEnvironments();
    const envId = req.query._id;

    const environment = environments.find(e => e._id === envId);
    if (environment) {
        res.status(200).json({ code: "OK", object: environment, message: "" });
    } else {
        res.status(404).json({ code: "NOT_FOUND", message: "Entorno no encontrado" });
    }
}

function toggleEnvironmentsStatus(req, res) {
    const environments = cargarEnvironments();
    const matchedEnvironmentIndex = environments.findIndex(env => env._id === req.body._id);

    if (matchedEnvironmentIndex === -1) {
        return res.status(404).json({ code: "NOT_FOUND", message: "El entorno no existe." });
    }

    const isEnabled = typeof req.body.isEnabled === 'string' ? req.body.isEnabled.toLowerCase() === "true" : req.body.isEnabled;
    environments[matchedEnvironmentIndex].isEnabled = isEnabled;

    guardarEnvironmentsData(environments);
    res.status(200).json({ code: "OK", object: environments[matchedEnvironmentIndex], message: "Estado del entorno actualizado con éxito." });
}

module.exports = {
    obtenerEnvironments,
    guardarEnvironments,
    toggleEnvironmentsStatus,
    fetchEnvironmentById
};
