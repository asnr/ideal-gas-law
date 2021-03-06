var Vector = gases.Vector;
var GasBox = gases.GasBox;
var internalFuncs = gases.exposedforTESTINGONLY;
var Molecule = internalFuncs.Molecule;
var MoleculeCollection = internalFuncs.MoleculeCollection;
var innerProd = internalFuncs.innerProd;
var avgVec = internalFuncs.avgVec;
var _calculatePostCollisionVelocity = internalFuncs._calculatePostCollisionVelocity;



/*************************************
 * Vector Unit Tests
 *************************************/
QUnit.module("Vector tests", {
    setup: function() {
        v1 = new Vector(0,0);
        v2 = new Vector(1,0);
        v3 = new Vector(0,-1);
        v4 = new Vector(-0.5, 2);

        p1 = new Vector(0, 0);
        p2 = new Vector(0, 1);
        p3 = new Vector(1, 0);

        m = 1;
    }
});

QUnit.test("innerProd test", function (assert) {
    assert.strictEqual(innerProd(v1, v2), 0, '');
    assert.strictEqual(innerProd(v2, v2), 1, '');
    assert.strictEqual(innerProd(v1, v2), 0, '');
});

QUnit.test("magnitudeSqrd test", function (assert) {
    assert.strictEqual(v1.magnitudeSqrd(), 0, '');
    assert.strictEqual(v2.magnitudeSqrd(), 1, '');
    assert.strictEqual(v3.magnitudeSqrd(), 1, '');
    assert.strictEqual(v4.magnitudeSqrd(), 4.25, '');
});

function testVectorEquality(assert, v1, v2, msg) {
    msg = msg || '';
    assert.strictEqual(v1.x, v2.x, msg + ' x bad');
    assert.strictEqual(v1.y, v2.y, msg + ' y bad');
}

QUnit.test("Calc post collision test", function (assert) {
    var calculated = _calculatePostCollisionVelocity(v1, v1, p1, p2, m, m);
    var expected = new Vector(0, 0);
    testVectorEquality(assert, calculated, expected);

    calculated = _calculatePostCollisionVelocity(v1, v2, p3, p1, m, m);
    expected = new Vector(1, 0);
    testVectorEquality(assert, calculated, expected);
});


QUnit.module("avgVec Tests", {
    setup: function() {
        v0 = new Vector(0, 0);
        v1 = new Vector(1, 0);
        v2 = new Vector(0, 1);
        v3 = new Vector(2, 2);
        v4 = new Vector(-1, 2);
    }
});

QUnit.test("avgVec tests", function (assert) {
    var testName = "avgVec tests";
    assert.strictEqual(avgVec([]), undefined, 'avg of empty arr is undefined');

    testVectorEquality(assert, avgVec([v0]), v0, testName);

    testVectorEquality(assert, avgVec([v0, v1]), new Vector(0.5, 0), testName);

    testVectorEquality(assert, avgVec([v1, v4]), new Vector(0, 1), testName);    
});


/*************************************
 * Molecule Unit Tests
 *************************************/
QUnit.test('getCentre test', function( assert ) {
    var mol1 = new Molecule(0, 0, 1);
    var mol2 = new Molecule(0, 1, 1);
    var mol3 = new Molecule(3, 3, 2);

    function testCentre(mol, expectedx, expectedy) {
        var molCentre = mol.getCentre();
        assert.ok(molCentre.x === expectedx, 'centre x coord wrong');
        assert.ok(molCentre.y === expectedy, 'centre y coord wrong');
    }

    testCentre(mol1, 0, 0);
    testCentre(mol2, 0, 1);
    testCentre(mol3, 3, 3);
});

QUnit.test('getRadius test', function (assert) {
    var mol1 = new Molecule(0, 0, 1);
    var mol2 = new Molecule(0, 1, 1.5);
    var mol3 = new Molecule(3, 3, 2);

    assert.strictEqual(mol1.getRadius(), 1, 'getRadius bad');
    assert.strictEqual(mol2.getRadius(), 1.5, 'getRadius bad');
    assert.strictEqual(mol3.getRadius(), 2, 'getRadius bad');
});

QUnit.test('Centre distance squared test', function( assert ) {
    var mol1 = new Molecule(0, 0, 1);
    var mol2 = new Molecule(0, 1, 1);
    var mol3 = new Molecule(3, 3, 2);

    assert.strictEqual(mol1._centreDistSqrd(mol2), 1,
              'Square of the distances between circle centres incorrectly calculated');
    assert.strictEqual(mol1._centreDistSqrd(mol3), 18,
              'Square of the distances between circle centres incorrectly calculated');
    assert.strictEqual(mol2._centreDistSqrd(mol3), 13,
              'Square of the distances between circle centres incorrectly calculated');
});


QUnit.test('Collision test', function( assert ) {
    var mol1 = new Molecule(0, 0, 1);
    var mol2 = new Molecule(0, 1, 1);
    var mol3 = new Molecule(3, 3, 2);

    assert.ok(mol1.collides(mol2), 'Collision 1 not detected');
    assert.ok(!mol1.collides(mol3), 'Collision 2 false positive');
});

QUnit.test("Backtrack to contact test", function (assert) {
    var mol1 = new Molecule(1, 0, 1, 1, 0);
    var mol2 = new Molecule(2, 0, 1, 0, 0);
    assert.strictEqual(mol1._backtrackToContactWith(mol2), 1, '');

    var mol3 = new Molecule(0, 1, 1, 0, 1);
    var mol4 = new Molecule(0, 2, 1, 0, 0);
    assert.strictEqual(mol3._backtrackToContactWith(mol4), 1, '');

    var mol5 = new Molecule(0.5, 0.5, 1, 1, 1);
    var mol6 = new Molecule(3, 0, 2, 0, 0);
    assert.strictEqual(mol5._backtrackToContactWith(mol6), 0.5, '');    
});


QUnit.module('Molecule movement tests', {
    setup: function() {
        mol1 = new Molecule(0, 0, 1, 0, 0);
        mol2 = new Molecule(0, 1, 1.5, -2, 1.5);
        mol3 = new Molecule(3, 3, 2, -10, -20);
    }
});


QUnit.test("Molecule getMomentum tests", function (assert) {
    var expected = new Vector(0, 0);
    testVectorEquality(assert, mol1.getMomentum(), expected, 'momentum bad');

    mol2.mass = 10;
    expected = new Vector(-20, 15);
    testVectorEquality(assert, mol2.getMomentum(), expected, 'momentum bad');

    mol3.mass = 1;
    expected = new Vector(-10, -20);
    testVectorEquality(assert, mol3.getMomentum(), expected, 'momentum bad');
});

QUnit.test("Molecule getKineticEnergy test", function (assert) {
    assert.strictEqual(mol1.getKineticEnergy(), 0, 'bad kineticEnergy');
    mol2.mass = 2;
    assert.strictEqual(mol2.getKineticEnergy(), 6.25, 'bad kineticEnergy');
    mol3.mass = 1;
    assert.strictEqual(mol3.getKineticEnergy(), 250, 'bad kineticEnergy');
});

QUnit.test("velocity get/set", function (assert) {
    assert.strictEqual(mol1.getVelocity().x, 0,
                       'Molecule constructor/getVelocity bad');
    assert.strictEqual(mol1.getVelocity().y, 0,
                       'Molecule constructor/getVelocity bad');
    assert.strictEqual(mol2.getVelocity().x, -2,
                       'Molecule constructor/getVelocity bad');
    assert.strictEqual(mol2.getVelocity().y, 1.5,
                       'Molecule constructor/getVelocity bad');
    assert.strictEqual(mol3.getVelocity().x, -10,
                       'Molecule constructor/getVelocity bad');
    assert.strictEqual(mol3.getVelocity().y, -20,
                       'Molecule constructor/getVelocity bad');

    mol1.setVelocity(new Vector(1, 1));
    assert.strictEqual(mol1.getVelocity().x, 1,
                       'Molecule set/getVelocity bad');
    assert.strictEqual(mol1.getVelocity().y, 1,
                       'Molecule set/getVelocity bad');
    mol1.setVelocity(new Vector(2000, -1.77));
    assert.strictEqual(mol1.getVelocity().x, 2000,
                       'Molecule set/getVelocity bad');
    assert.strictEqual(mol1.getVelocity().y, -1.77,
                       'Molecule set/getVelocity bad');
    mol1.setVelocity(new Vector(0, 0));
    assert.strictEqual(mol1.getVelocity().x, 0,
                       'Molecule set/getVelocity bad');
    assert.strictEqual(mol1.getVelocity().y, 0,
                       'Molecule set/getVelocity bad');
});

QUnit.test("advance test", function (assert) {
    var newCentre1 = mol1.advance(1).getCentre();
    assert.strictEqual(newCentre1.x, 0, 'Molecule.advance bad');
    assert.strictEqual(newCentre1.y, 0, 'Molecule.advance bad');

    var newCentre2 = mol2.advance(1).getCentre();
    assert.strictEqual(newCentre2.x, -2, 'Molecule.advance bad');
    assert.strictEqual(newCentre2.y, 2.5, 'Molecule.advance bad');

    var newCentre3 = mol3.advance(0).getCentre();
    assert.strictEqual(newCentre3.x, 3, 'Molecule.advance bad');
    assert.strictEqual(newCentre3.y, 3, 'Molecule.advance bad');
});


function testMoleculeEquality(assert, mol1, mol2, msg) {
    msg = msg || '';
    var c1 = mol1.getCentre();
    var r1 = mol1.getRadius(),
        m1 = mol1.mass;
    var v1 = mol1.getVelocity();
    var c2 = mol2.getCentre();
    var r2 = mol2.getRadius(),
        m2 = mol2.mass;
    var v2 = mol2.getVelocity();
    assert.strictEqual(c1.x, c2.x, msg + ' x-coord of centre bad');
    assert.strictEqual(c1.y, c2.y, msg + ' y-coord of centre bad');
    assert.strictEqual(v1.x, v2.x, msg + ' x-coord of velocity bad');
    assert.strictEqual(v1.y, v2.y, msg + ' y-coord of velocity bad');
    assert.strictEqual(r1, r2, msg + ' radius bad');
    assert.strictEqual(m1, m2, msg + ' mass bad');
}


QUnit.module("module collision tests", {
    setup: function() {
        mol0 = new Molecule(0, 0, 1, 0, 0);
        mol1 = new Molecule(0, 0, 1, 1, 0);
        mol2 = new Molecule(1, 0, 1, 0, 0);
    }
});

QUnit.test("static test", function (assert) {
    var testName = "static test";
    mol0.collideWith(mol2);
    var exp0 = new Molecule(0, 0, 1, 0, 0);
    var exp2 = new Molecule(1, 0, 1, 0, 0);
    testMoleculeEquality(assert, mol0, exp0, testName);
    testMoleculeEquality(assert, mol2, exp2, testName);
});

QUnit.test("x axis test", function (assert) {
    var testName = 'x axis test';
    mol1.collideWith(mol2);
    var exp1 = new Molecule(0, 0, 1, 0, 0);
    var exp2 = new Molecule(1, 0, 1, 1, 0);
    testMoleculeEquality(assert, mol1, exp1, testName);
    testMoleculeEquality(assert, mol2, exp2, testName);
});

/*************************************
 * MoleculeCollection Unit Tests
 *************************************/
QUnit.module('MoleculeCollection tests', {
    setup: function() {
        mol1 = new Molecule(0, 0, 1);
        mol2 = new Molecule(0, 1, 1);
        mol3 = new Molecule(3, 3, 2);
        
        collEmpty = new MoleculeCollection();
        
        collFull = new MoleculeCollection();
        collFull.addMolecule(mol1);
        collFull.addMolecule(mol3);
    }
});

QUnit.test('Add molecule test', function(assert) {
    var firstAdd = collEmpty.addMolecule(mol1);
    assert.strictEqual(firstAdd, true, "addMolecule didn't add");
    var secondAdd = collEmpty.addMolecule(mol2);
    assert.strictEqual(secondAdd, false, 'addMolecule bad');
    var thirdAdd = collEmpty.addMolecule(mol3);
    assert.strictEqual(firstAdd, true, "addMolecule didn't add");
});

QUnit.test("getMolecules test", function (assert) {
    var emptyMolecules = Object.keys(collEmpty.getMolecules());
    assert.strictEqual(emptyMolecules.length, 0, 'should have no molecules');

    var fullMolecules = collFull.getMolecules();
    var expected = {
        '0': mol1,
        '1': mol3
    };
    for (var prop in fullMolecules) {
        if (Object.hasOwnProperty.call(fullMolecules, prop))
            testMoleculeEquality(assert, fullMolecules[prop], expected[prop]);
    }
    
});

QUnit.test("getCollider test", function (assert) {
    assert.strictEqual(collEmpty._getCollider(mol1), null, '');
    collEmpty.addMolecule(mol1);
    var colliderMol = collEmpty._getCollider(mol2);
    testMoleculeEquality(assert, mol1, colliderMol);
});


QUnit.module("Collection movement tests", {
    setup: function() {
        gasBox = new GasBox(10, 10);
        collMobile = gasBox._molecules;
    }
});

QUnit.test("advance test", function (assert) {
    mobile1 = new Molecule(5, 5, 1, 1, 0);
    collMobile.addMolecule(mobile1);
    collMobile.advance(1);
    var movedMolecule = collMobile.getMolecules()['0'];
    mobileMoved = new Molecule(6, 5, 1, 1, 0);
    testMoleculeEquality(assert, movedMolecule, mobileMoved);    
});

QUnit.test("advance and bounce test", function (assert) {
    mobile1 = new Molecule(8, 5, 1, 2, 0);
    collMobile.addMolecule(mobile1);
    collMobile.advance(1);
    var movedMolecule = collMobile.getMolecules()['0'];
    mobileMoved = new Molecule(8, 5, 1, -2, 0);
    testMoleculeEquality(assert, movedMolecule, mobileMoved);    
});


/*************************************
 * GasBox Unit Tests
 *************************************/
QUnit.module("GasBox tests", {
    setup: function() {
        box = new GasBox(10, 10, 0, 1);
        mol0 = new Molecule(5, 5, 1, 0, 0);
        mol1 = new Molecule(-1, 5, 1, -1, 0);
        mol2 = new Molecule(5, -1, 1, 0, -1);
        mol3 = new Molecule(9.5, 5, 1, 1, 0);
        mol4 = new Molecule(5, 9.5, 1, 0, 1);
    }
});

QUnit.test("bounce1D test", function (assert) {
    var bounced = box._bounce1D(10, 20, 4, -5);
    assert.strictEqual(bounced.pos, 16);
    assert.strictEqual(bounced.vel, 5);

    bounced = box._bounce1D(-2, 1, 0, -5);
    assert.strictEqual(bounced.pos, 0);
    assert.strictEqual(bounced.vel, -5);
});

QUnit.test("bounce test", function (assert) {
    box.bounce(mol0);
    var expected = new Molecule(5, 5, 1, 0, 0);
    testMoleculeEquality(assert, mol0, expected);

    box.bounce(mol1);
    expected = new Molecule(3, 5, 1, 1, 0);
    testMoleculeEquality(assert, mol1, expected);

    box.bounce(mol2);
    expected = new Molecule(5, 3, 1, 0, 1);
    testMoleculeEquality(assert, mol2, expected);

    box.bounce(mol3);
    expected = new Molecule(8.5, 5, 1, -1, 0);
    testMoleculeEquality(assert, mol3, expected);

    box.bounce(mol4);
    expected = new Molecule(5, 8.5, 1, 0, -1);
    testMoleculeEquality(assert, mol4, expected);
});

