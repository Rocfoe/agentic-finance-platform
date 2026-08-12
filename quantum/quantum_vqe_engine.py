from __future__ import annotations

import logging
from typing import Sequence

import pennylane as qml
from pennylane import numpy as np

logger = logging.getLogger("QuantumVQEEngine")

NUM_QUBITS = 4
DEV = qml.device("default.qubit", wires=NUM_QUBITS)


def create_cost_hamiltonian(spot_prices: Sequence[float], tariffs: Sequence[float]):
    if len(spot_prices) != NUM_QUBITS or len(tariffs) != NUM_QUBITS:
        raise ValueError(f"Expected {NUM_QUBITS} spot prices and tariffs")
    if any(float(x) < 0 for x in spot_prices) or any(float(x) < 0 for x in tariffs):
        raise ValueError("spot prices and tariffs must be non-negative")

    coeffs = []
    observables = []
    for i in range(NUM_QUBITS):
        coeffs.append(float(spot_prices[i]) * (1.0 + float(tariffs[i])))
        observables.append(qml.PauliZ(i))

    for i in range(NUM_QUBITS - 1):
        coeffs.append(0.25 * float(spot_prices[i]))
        observables.append(qml.PauliZ(i) @ qml.PauliZ(i + 1))

    return qml.Hamiltonian(coeffs, observables)


@qml.qnode(DEV)
def vqe_circuit(params, hamiltonian):
    for i in range(NUM_QUBITS):
        qml.Hadamard(wires=i)
        qml.RY(params[i], wires=i)
    for i in range(NUM_QUBITS - 1):
        qml.CNOT(wires=[i, i + 1])
    for i in range(NUM_QUBITS):
        qml.RZ(params[NUM_QUBITS + i], wires=i)
    return qml.expval(hamiltonian)


def optimize_global_cost_floor(
    spot_prices: Sequence[float],
    tariffs: Sequence[float],
    steps: int = 100,
    stepsize: float = 0.05,
) -> dict:
    if steps < 1:
        raise ValueError("steps must be >= 1")

    hamiltonian = create_cost_hamiltonian(spot_prices, tariffs)
    np.random.seed(42)
    params = np.random.random(NUM_QUBITS * 2, requires_grad=True)
    optimizer = qml.GradientDescentOptimizer(stepsize=stepsize)

    energy = float(vqe_circuit(params, hamiltonian))
    for step in range(steps):
        params, energy = optimizer.step_and_cost(lambda p: vqe_circuit(p, hamiltonian), params)
        if (step + 1) % 25 == 0:
            logger.info("VQE step %03d | energy %.9f", step + 1, float(energy))

    return {
        "optimized_parameters": params.tolist(),
        "minimum_cost_ground_state": float(energy),
        "qubit_count": NUM_QUBITS,
        "steps": steps,
        "status": "classical_simulator_vqe",
    }


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    result = optimize_global_cost_floor([2.45, 15.20, 9.10, 0.85], [0.05, 0.12, 0.08, 0.02])
    print(result)
