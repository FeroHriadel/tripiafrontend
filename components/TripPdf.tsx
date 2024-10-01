import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { formatUTCToHumanreadable } from '@/utils/dates';
import { Trip } from '../types';



interface Props {
  trip: Trip;
  categoryName: string;
  mapImages?: { meeting: string; destination: string }; // Add map images prop
}



const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
    color: '#F48957',
    fontFamily: 'Helvetica-Bold',
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 0,
  },
  keyword: {
    backgroundColor: '#F48957',
    color: 'white',
    paddingHorizontal: 6,
    paddingVertical: 5,
    borderRadius: 8,
    margin: 5,
    marginBottom: 10,
    fontSize: 10,
  },
  category: {
    fontSize: 10,
    marginBottom: 20,
    color: 'black',
    textAlign: 'center',
  },
  sectionHeading: {
    fontSize: 12,
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
  },
  sectionText: {
    fontSize: 12,
    color: 'black',
    fontFamily: 'Helvetica',
    marginBottom: 10,
  },
  mapImage: {
    width: '100%',
    height: 250,
    marginBottom: 10,
  },
});

const TripPdf = ({ trip, categoryName, mapImages }: Props) => {
  const { name, keyWords } = trip;

  function tagsFromKeywords() {
    return keyWords ? keyWords.split(',').map((word) => word.trim()) : [];
  }

  function renderSection(heading: string, text: string) {
    return (
      <>
        <Text style={styles.sectionHeading}>{heading}</Text>
        <Text style={styles.sectionText}>{text}</Text>
      </>
    );
  }


  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* title */}
        <Text style={styles.title}>{name.toUpperCase()}</Text>

        {/* keywords */}
        {keyWords && (
          <View style={styles.keywordsContainer}>
            {tagsFromKeywords().map((keyWord, idx) => (
              <Text style={styles.keyword} key={keyWord + idx}>
                {keyWord}
              </Text>
            ))}
          </View>
        )}

        {/* category */}
        {categoryName && <Text style={styles.category}>{categoryName}</Text>}

        {/* destination */}
        {renderSection('Destination: ', trip.destination)}

        {/* destination map image */}
        {mapImages?.destination && <Image style={styles.mapImage} src={mapImages.destination} />}

        {/* description */}
        {renderSection('Description: ', trip.description)}

        {/* requirements */}
        {trip.requirements && renderSection('Requirements: ', trip.requirements)}

        {/* date */}
        {renderSection('Date: ', formatUTCToHumanreadable(trip.departureDate) + ' at ' + ` ${trip.departureTime}`)}

        {/* meeting point */}
        {renderSection('Meeting Point: ', trip.departureFrom)}

        {/* meeting point map image */}
        {mapImages?.meeting && <Image style={styles.mapImage} src={mapImages.meeting} />}  
      </Page>
    </Document>
  );
};

export default TripPdf;
