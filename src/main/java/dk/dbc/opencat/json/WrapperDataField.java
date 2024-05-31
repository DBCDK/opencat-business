package dk.dbc.opencat.json;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class WrapperDataField {
    private String name;
    private String indicator;
    private List<WrapperSubField> subfields;

    public WrapperDataField() {
    }

    public WrapperDataField(String name, String indicator) {
        this.name = name;
        this.indicator = indicator;
        this.subfields = new ArrayList<>();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIndicator() {
        return indicator;
    }

    public void setIndicator(String indicator) {
        this.indicator = indicator;
    }

    public List<WrapperSubField> getSubfields() {
        return subfields;
    }

    public void setSubfields(List<WrapperSubField> subfields) {
        this.subfields = subfields;
    }

    @Override
    public String toString() {
        return "WrapperDataField{" +
                "name='" + name + '\'' +
                ", indicator='" + indicator + '\'' +
                ", subfields=" + subfields +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        WrapperDataField that = (WrapperDataField) o;
        return Objects.equals(name, that.name) && Objects.equals(indicator, that.indicator) && Objects.equals(subfields, that.subfields);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, indicator, subfields);
    }
}
