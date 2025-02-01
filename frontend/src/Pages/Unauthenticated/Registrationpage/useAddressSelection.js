import { useState, useCallback } from 'react';

export function useAddressSelection() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subDistricts, setSubDistricts] = useState([]);
  const [villages, setVillages] = useState([]);

  const fetchCountries = useCallback(async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/address/countries/');
      const data = await response.json();
      setCountries(data);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  }, []);

  const fetchStates = useCallback(async (countryId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/address/states/${countryId}/`);
      const data = await response.json();
      setStates(data);
      return data;
    } catch (error) {
      console.error('Error fetching states:', error);
      return [];
    }
  }, []);

  const fetchDistricts = useCallback(async (stateId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/address/districts/${stateId}/`);
      const data = await response.json();
      setDistricts(data);
      return data;
    } catch (error) {
      console.error('Error fetching districts:', error);
      return [];
    }
  }, []);

  const fetchSubdistricts = useCallback(async (districtId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/address/subdistricts/${districtId}/`);
      const data = await response.json();
      setSubDistricts(data);
      return data;
    } catch (error) {
      console.error('Error fetching subdistricts:', error);
      return [];
    }
  }, []);

  const fetchVillages = useCallback(async (subdistrictId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/address/villages/${subdistrictId}/`);
      const data = await response.json();
      setVillages(data);
      return data;
    } catch (error) {
      console.error('Error fetching villages:', error);
      return [];
    }
  }, []);

  return {
    countries,
    states,
    districts,
    subDistricts,
    villages,
    fetchCountries,
    fetchStates,
    fetchDistricts,
    fetchSubdistricts,
    fetchVillages,
    setCountries,
    setStates,
    setDistricts,
    setSubDistricts,
    setVillages
  };
}