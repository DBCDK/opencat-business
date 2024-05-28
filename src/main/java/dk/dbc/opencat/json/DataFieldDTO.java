package dk.dbc.opencat.json;

import java.util.List;

public class DataFieldDTO {
    private String name;
    private List<String> indicator;
    private List<SubFieldDTO> subfields;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getIndicator() {
        return indicator;
    }

    public void setIndicator(List<String> indicator) {
        this.indicator = indicator;
    }

    public List<SubFieldDTO> getSubfields() {
        return subfields;
    }

    public void setSubfields(List<SubFieldDTO> subfields) {
        this.subfields = subfields;
    }

    @Override
    public String toString() {
        return "DataFieldDTO{" +
                "name='" + name + '\'' +
                ", indicator=" + indicator +
                ", subfields=" + subfields.toString() +
                '}';
    }
}
