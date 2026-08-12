from quantum_vqe_engine import create_cost_hamiltonian, optimize_global_cost_floor


def test_hamiltonian_builds():
    h = create_cost_hamiltonian([2.45, 15.20, 9.10, 0.85], [0.05, 0.12, 0.08, 0.02])
    assert len(h.ops) == 7


def test_vqe_returns_finite_result():
    result = optimize_global_cost_floor([2.45, 15.20, 9.10, 0.85], [0.05, 0.12, 0.08, 0.02], steps=3)
    assert result["qubit_count"] == 4
    assert result["status"] == "classical_simulator_vqe"
    assert len(result["optimized_parameters"]) == 8
