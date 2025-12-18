import { useState, useEffect } from 'react';
import { carService } from '@/services';
import { Car } from '@/types';
import VehicleCard from '@/components/VehicleCard';
import styles from '@/styles/pages/Catalog.module.scss';

export default function Catalog() {
    const [cars, setCars] = useState<Car[]>([]);
    const [filteredCars, setFilteredCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        brand: '',
        minPrice: '',
        maxPrice: '',
        minYear: '',
        maxYear: '',
        color: '',
        availableOnly: false,
    });

    useEffect(() => {
        loadCars();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, cars]);

    const loadCars = async () => {
        try {
            const data = await carService.getAll();
            setCars(data);
            setFilteredCars(data);
        } catch (error) {
            console.error('Error loading cars:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...cars];

        // Search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(
                (car) =>
                    car.brand.toLowerCase().includes(searchLower) ||
                    car.model.toLowerCase().includes(searchLower) ||
                    car.plate.toLowerCase().includes(searchLower)
            );
        }

        // Brand filter
        if (filters.brand) {
            filtered = filtered.filter((car) => car.brand === filters.brand);
        }

        // Price filter
        if (filters.minPrice) {
            filtered = filtered.filter((car) => car.basePricePerHour >= parseFloat(filters.minPrice));
        }
        if (filters.maxPrice) {
            filtered = filtered.filter((car) => car.basePricePerHour <= parseFloat(filters.maxPrice));
        }

        // Year filter
        if (filters.minYear) {
            filtered = filtered.filter((car) => car.year >= parseInt(filters.minYear));
        }
        if (filters.maxYear) {
            filtered = filtered.filter((car) => car.year <= parseInt(filters.maxYear));
        }

        // Color filter
        if (filters.color) {
            filtered = filtered.filter((car) => car.color.toLowerCase() === filters.color.toLowerCase());
        }

        // Available only filter
        if (filters.availableOnly) {
            filtered = filtered.filter((car) => car.isAvailable);
        }

        setFilteredCars(filtered);
    };

    const uniqueBrands = Array.from(new Set(cars.map((car) => car.brand))).sort();
    const uniqueColors = Array.from(new Set(cars.map((car) => car.color))).sort();

    const clearFilters = () => {
        setFilters({
            search: '',
            brand: '',
            minPrice: '',
            maxPrice: '',
            minYear: '',
            maxYear: '',
            color: '',
            availableOnly: false,
        });
    };

    return (
        <div className={styles.catalogContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>Catálogo de Vehículos</h1>
                <p className={styles.subtitle}>
                    Encuentra el vehículo perfecto para tu próxima aventura
                </p>
            </div>

            <div className={styles.content}>
                {/* Filters Sidebar */}
                <aside className={styles.sidebar}>
                    <div className={styles.filtersHeader}>
                        <h2 className={styles.filtersTitle}>Filtros</h2>
                        <button onClick={clearFilters} className={styles.clearButton}>
                            Limpiar
                        </button>
                    </div>

                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Buscar</label>
                        <input
                            type="text"
                            className={styles.filterInput}
                            placeholder="Marca, modelo, placa..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                    </div>

                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Marca</label>
                        <select
                            className={styles.filterSelect}
                            value={filters.brand}
                            onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                        >
                            <option value="">Todas las marcas</option>
                            {uniqueBrands.map((brand) => (
                                <option key={brand} value={brand}>
                                    {brand}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Precio por Hora</label>
                        <div className={styles.rangeInputs}>
                            <input
                                type="number"
                                className={styles.filterInput}
                                placeholder="Mín"
                                value={filters.minPrice}
                                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                            />
                            <span>-</span>
                            <input
                                type="number"
                                className={styles.filterInput}
                                placeholder="Máx"
                                value={filters.maxPrice}
                                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Año</label>
                        <div className={styles.rangeInputs}>
                            <input
                                type="number"
                                className={styles.filterInput}
                                placeholder="Desde"
                                value={filters.minYear}
                                onChange={(e) => setFilters({ ...filters, minYear: e.target.value })}
                            />
                            <span>-</span>
                            <input
                                type="number"
                                className={styles.filterInput}
                                placeholder="Hasta"
                                value={filters.maxYear}
                                onChange={(e) => setFilters({ ...filters, maxYear: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Color</label>
                        <select
                            className={styles.filterSelect}
                            value={filters.color}
                            onChange={(e) => setFilters({ ...filters, color: e.target.value })}
                        >
                            <option value="">Todos los colores</option>
                            {uniqueColors.map((color) => (
                                <option key={color} value={color}>
                                    {color}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.filterGroup}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={filters.availableOnly}
                                onChange={(e) => setFilters({ ...filters, availableOnly: e.target.checked })}
                            />
                            Solo disponibles
                        </label>
                    </div>
                </aside>

                {/* Results */}
                <main className={styles.main}>
                    <div className={styles.resultsHeader}>
                        <p className={styles.resultsCount}>
                            {filteredCars.length} {filteredCars.length === 1 ? 'vehículo encontrado' : 'vehículos encontrados'}
                        </p>
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <div className="spinner"></div>
                            <p>Cargando vehículos...</p>
                        </div>
                    ) : filteredCars.length > 0 ? (
                        <div className={styles.grid}>
                            {filteredCars.map((car) => (
                                <VehicleCard key={car.id} car={car} />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <span className={styles.emptyIcon}>🔍</span>
                            <h3>No se encontraron vehículos</h3>
                            <p>Intenta ajustar los filtros para ver más resultados</p>
                            <button onClick={clearFilters} className={styles.emptyButton}>
                                Limpiar filtros
                            </button>
                        </div>
                    )}
                </main>
            </div>

            {/* Floating AI Assistant Button */}
            <a
                href="https://t.me/CarlendAssistantBot"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.floatingHelp}
                title="Chatea con nuestro asistente IA para encontrar el vehículo perfecto"
            >
                <span className={styles.helpIcon}>💬</span>
                <span className={styles.helpText}>Ayuda IA</span>
            </a>
        </div>
    );
}
