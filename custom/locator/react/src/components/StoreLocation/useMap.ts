import { useEffect, useMemo, useState } from 'react';
import { pathOr, path } from 'ramda';
export interface StoreProps {
  image?: string;
  __editorItemTitle: string;
  type: string;
  address: string;
  waze: string;
  schedule: string;
  lat: number;
  lng: number;
  consultant: string;
  phone: string;
  email: string;
  others?: OtherProps[];
}
export interface OtherProps {
  __editorItemTitle: string;
  description: string;
}
export interface CityProps {
  __editorItemTitle: string;
  stores: StoreProps[];
}
export interface DepartmentProps {
  __editorItemTitle: string;
  city: CityProps[];
}
export interface CountryProps {
  __editorItemTitle: string;
  department: DepartmentProps[];
}
export interface StoreLocationProps {
  google: string;
  title: string;
  country: CountryProps[];
  department: DepartmentProps[];
  countryName: string;
  departmentName: string;
  cityName: string;
  storeName: string;
  hiddenDepartment: boolean;
}

export const useMap = (props: StoreLocationProps) => {
  const google = pathOr('', ['google'], props);
  const countries = pathOr([], ['country'], props);
  const [departments, setDepartments] = useState<DepartmentProps[]>([]);
  const [cities, setCities] = useState<CityProps[]>([]);
  const [stores, setStores] = useState<StoreProps[]>([]);
  const [country, setCountry] = useState<CountryProps>();
  const [department, setDepartment] = useState<DepartmentProps>();
  const [city, setCity] = useState<CityProps>();
  const [store, setStore] = useState<StoreProps>();

  const containerStyle = {
    position: 'relative',
    width: '100%',
    height: '100%'
  }

  useEffect(() => {
    if (country) {
      const c: any = path(['department'], country);
      const s: any = path([0], c);
      setDepartments(c);
      setDepartment(s);
    }
  }, [country])

  useEffect(() => {
    if (department) {
      const c: any = path(['city'], department);
      const s: any = path([0], c);
      setCities(c);
      setCity(s);
    }
  }, [department])

  useEffect(() => {
    if (city) {
      const s: any = path(['stores'], city);
      const c: any = path([0], s);
      setStores(s);
      setStore(c);
    }
  }, [city])

  const countryList = useMemo(() => {
    if (!countries) return [];
    const d: any = path([0], countries);
    d && setCountry(d);
    return countries.map((country: CountryProps) => ({
      label: country.__editorItemTitle,
      value: JSON.stringify(country)
    }));
  }, [countries]);

  const departmentList = useMemo(() => {
    if (!departments) return [];
    return departments.map((department: DepartmentProps) => ({
      label: department.__editorItemTitle,
      value: JSON.stringify(department)
    }));
  }, [departments]);

  const citiesList = useMemo(() => {
    if (!cities) return [];
    return cities.map((city: CityProps) => ({
      label: city.__editorItemTitle,
      value: JSON.stringify(city)
    }));
  }, [cities]);

  const storesList = useMemo(() => {
    if (!stores) return [];
    return stores.map((store: StoreProps) => ({
      label: store.__editorItemTitle,
      value: JSON.stringify(store)
    }));
  }, [stores]);

  const onChangeCountry = (e: string) => {
    const d = JSON.parse(e);
    const c = pathOr([], ['department'], d);
    setCountry(d);
    setDepartments(c);
  };

  const onChangeDepartment = (e: string) => {
    const d = JSON.parse(e);
    const c = pathOr([], ['city'], d);
    setDepartment(d);
    setCities(c);
  };

  const onChangeCity = (e: string) => {
    const c = JSON.parse(e);
    const s = pathOr([], ['stores'], c);
    setCity(c);
    setStores(s);
  };

  const onChangeStore = (e: string) => {
    const d = JSON.parse(e);
    setStore(d);
  };

  return {
    countryName: props.countryName,
    google,
    countries: countryList,
    country,
    departments: departmentList,
    department,
    cities: citiesList,
    city,
    stores: storesList,
    store,
    onChangeCountry,
    onChangeDepartment,
    onChangeCity,
    onChangeStore,
    containerStyle,
    cityName: props.cityName,
    departmentName: props.departmentName,
    storeName: props.storeName,
    hiddenDepartment: props.hiddenDepartment
  }
}